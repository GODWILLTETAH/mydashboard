import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_BASE_URL, MEDIA_BASE_URL  } from '../config';
import { FaTrash } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const Phrases = () => {
  const [phrases, setPhrases] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [filteredPhrases, setFilteredPhrases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    language: '',
    lesson: [],
    text: '',
    pronunciation: '',
    translation: '',
    meaning: '',
    imageUrl: null,
    audioUrl: null,
    videoUrl: null,
  });
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchPhrases = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/phrase`);
      setPhrases(res.data);
      setFilteredPhrases(res.data);
    } catch (err) {
      console.error('Failed to load phrases:', err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/languages`);
      setLanguages(res.data);
    } catch (err) {
      console.error('Failed to load languages:', err);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/lesson`);
      setLessons(res.data);
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };

  useEffect(() => {
    fetchPhrases();
    fetchLanguages();
    fetchLessons();
  }, []);

  useEffect(() => {
    const filtered = phrases.filter(phrase =>
      phrase.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.pronunciation.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPhrases(filtered);
    setCurrentPage(1);
  }, [searchQuery, phrases]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === 'lesson') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setFormData({ ...formData, lesson: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or not available.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== 'audioUrl' && key !== 'lesson' && val) data.append(key, val);
    });

    formData.lesson.forEach(id => data.append('lesson', id));

    if (recordedAudio) {
      const file = new File([recordedAudio], "recording.webm", { type: "audio/webm" });
      data.append("audioUrl", file);
    } else if (formData.audioUrl) {
      data.append("audioUrl", formData.audioUrl);
    }

    try {
      await axios.post(`${API_BASE_URL}/phrase`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ Phrase created successfully');
      setFormData({ language: '', lesson: [], text: '', pronunciation: '', translation: '', meaning: '', imageUrl: null, audioUrl: null, videoUrl: null });
      setRecordedAudio(null);
      fetchPhrases();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error creating phrase');
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this phrase?")) return;
    setDeletingId(id);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/phrase/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPhrases();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const mediaUrl = (relativePath) => {
    if (!relativePath || relativePath === 'null') return null;
    return `${MEDIA_BASE_URL}${relativePath}`;
  };

  const paginatedPhrases = filteredPhrases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPhrases.length / itemsPerPage);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>💬 Phrases</h2>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxWidth: '700px', margin: '0 auto 40px' }}>
        <h3 style={{ marginBottom: '15px' }}>Add New Phrase</h3>
        <select name="language" value={formData.language} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }}>
          <option value="">Select Language</option>
          {languages.map(lang => <option key={lang._id} value={lang._id}>{lang.name}</option>)}
        </select>
        <select name="lesson" multiple value={formData.lesson} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%', height: '100px' }}>
          {lessons.map(lesson => <option key={lesson._id} value={lesson._id}>{lesson.title}</option>)}
        </select>
        <input type="text" name="text" placeholder="Phrase text" value={formData.text} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }} />
        <input type="text" name="pronunciation" placeholder="Pronunciation" value={formData.pronunciation} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }} />
        <input type="text" name="translation" placeholder="Translation (optional)" value={formData.translation} onChange={handleChange} style={{ marginBottom: '10px', padding: '10px', width: '100%' }} />
        <textarea name="meaning" placeholder="Meaning" value={formData.meaning} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }}></textarea>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <label>Image:</label>
            <input type="file" name="imageUrl" accept="image/*" onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Audio:</label>
            {!isRecording && !recordedAudio && (
              <>
                <input type="file" name="audioUrl" accept="audio/*" onChange={handleChange} style={{ width: '100%' }} />
                <button type="button" onClick={startRecording} style={{ marginTop: '5px', padding: '6px 10px' }}>🎙️ Record</button>
              </>
            )}
            {isRecording && <p style={{ color: 'red', fontWeight: 'bold' }}>🔴 Recording... <button type="button" onClick={stopRecording} style={{ marginLeft: '10px', color: '#fff', backgroundColor: 'red', padding: '5px 10px' }}>Stop</button></p>}
            {recordedAudio && (
              <div style={{ marginTop: '10px' }}>
                <audio controls src={URL.createObjectURL(recordedAudio)} style={{ width: '100%' }} />
                <button type="button" onClick={() => setRecordedAudio(null)} style={{ marginTop: '5px', padding: '5px 10px', backgroundColor: '#f87171', color: '#fff' }}>
                  ❌ Discard Recording
                </button>
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label>Video:</label>
            <input type="file" name="videoUrl" accept="video/*" onChange={handleChange} style={{ width: '100%' }} />
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px' }}>
          {loading ? <ImSpinner2 className="spinner-icon" /> : 'Add Phrase'}
        </button>
        {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
      </form>

      <div style={{ marginBottom: '15px' }}>
        <input type="text" placeholder="Search phrases..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
      </div>

      <h3 style={{ marginBottom: '15px' }}>Available Phrases</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Text</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Pronunciation</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Meaning</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Language</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Lesson(s)</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Media</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPhrases.map(phrase => (
              <tr key={phrase._id}>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  {phrase.text}<br />
                  <small style={{ color: '#6b7280' }}>{phrase.createdBy?.username} ({phrase.createdBy?.email})<br />{new Date(phrase.createdAt).toLocaleDateString()}</small>
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{phrase.pronunciation}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{phrase.meaning}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{phrase.language?.name || 'N/A'}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{phrase.lesson?.map(l => l.title).join(', ')}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {mediaUrl(phrase.imageUrl) && (
                      <img src={mediaUrl(phrase.imageUrl)} alt="phrase-img" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    {mediaUrl(phrase.audioUrl) && (
                      <audio controls src={mediaUrl(phrase.audioUrl)} style={{ width: '120px' }} />
                    )}
                    {mediaUrl(phrase.videoUrl) && (
                      <video width="120" height="80" controls src={mediaUrl(phrase.videoUrl)} style={{ borderRadius: '4px' }} />
                    )}
                  </div>
                </td>

                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  <button onClick={() => handleDelete(phrase._id)} disabled={deletingId === phrase._id} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                    {deletingId === phrase._id ? <ImSpinner2 className="spinner-icon" /> : <FaTrash />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{ margin: '0 5px', padding: '6px 12px', backgroundColor: currentPage === page ? '#3b82f6' : '#e5e7eb', color: currentPage === page ? '#fff' : '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Phrase