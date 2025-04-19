import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_BASE_URL, MEDIA_BASE_URL  } from '../config';
import { FaTrash } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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

  const fetchLanguages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/languages`);
      setLanguages(res.data);
      setFilteredLanguages(res.data);
    } catch (err) {
      console.error('Failed to load languages:', err);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    const filtered = languages.filter(lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLanguages(filtered);
  }, [searchQuery, languages]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
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
      if (key !== 'audioUrl' && val) data.append(key, val);
    });

    if (recordedAudio) {
      const file = new File([recordedAudio], "recording.webm", { type: "audio/webm" });
      data.append("audioUrl", file);
    } else if (formData.audioUrl) {
      data.append("audioUrl", formData.audioUrl);
    }

    try {
      await axios.post(`${API_BASE_URL}/languages`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ Language created successfully');
      setFormData({ name: '', description: '', imageUrl: null, audioUrl: null, videoUrl: null });
      setRecordedAudio(null);
      fetchLanguages();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error creating language');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this language?")) return;
    setDeletingId(id);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/languages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLanguages();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const mediaUrl = (relativePath) => {
    if (!relativePath || relativePath === 'null') return null;
    return `${MEDIA_BASE_URL}/${relativePath}`;
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>🌐 Languages</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          maxWidth: '700px',
          margin: '0 auto 40px'
        }}
      >
        <h3 style={{ marginBottom: '15px' }}>Add New Language</h3>
        <input type="text" name="name" placeholder="Language name" value={formData.name} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }}></textarea>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
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
            {isRecording && (
              <p style={{ color: 'red', fontWeight: 'bold' }}>🔴 Recording... <button type="button" onClick={stopRecording} style={{ marginLeft: '10px', color: '#fff', backgroundColor: 'red', padding: '5px 10px' }}>Stop</button></p>
            )}
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
          {loading ? <ImSpinner2 className="spinner-icon" /> : 'Add Language'}
        </button>
        {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
      </form>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      <h3 style={{ marginBottom: '15px' }}>Available Languages</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Description</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Image</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Audio</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Video</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLanguages.map(lang => (
              <tr key={lang._id}>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  {lang.name}<br />
                  <small style={{ color: '#6b7280' }}>
                    {lang.createdBy?.username} ({lang.createdBy?.email})<br />
                    {new Date(lang.createdAt).toLocaleDateString()}
                  </small>
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{lang.description}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  {mediaUrl(lang.imageUrl) && <img src={mediaUrl(lang.imageUrl)} alt="lang-img" style={{ width: '50px' }} />}
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  {mediaUrl(lang.audioUrl) && <audio controls src={mediaUrl(lang.audioUrl)} style={{ width: '100px' }} />}
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  {mediaUrl(lang.videoUrl) && <video width="100" controls src={mediaUrl(lang.videoUrl)} />}
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  <button onClick={() => handleDelete(lang._id)} disabled={deletingId === lang._id} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                    {deletingId === lang._id ? <ImSpinner2 className="spinner-icon" /> : <FaTrash />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Languages;

