// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../config';
// import { FaTrash } from 'react-icons/fa';
// import { ImSpinner2 } from 'react-icons/im';

// const Lessons = () => {
//   const [lessons, setLessons] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [filteredLessons, setFilteredLessons] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     language: '',
//     imageUrl: null,
//     audioUrl: null,
//     videoUrl: null,
//   });
//   const [recordedAudio, setRecordedAudio] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const fetchLessons = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/lesson`);
//       setLessons(res.data);
//       setFilteredLessons(res.data);
//     } catch (err) {
//       console.error('Failed to load lessons:', err);
//     }
//   };

//   const fetchLanguages = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/languages`);
//       setLanguages(res.data);
//     } catch (err) {
//       console.error('Failed to load languages:', err);
//     }
//   };

//   useEffect(() => {
//     fetchLessons();
//     fetchLanguages();
//   }, []);

//   useEffect(() => {
//     const filtered = lessons.filter(lesson =>
//       lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredLessons(filtered);
//   }, [searchQuery, lessons]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
//       const chunks = [];

//       recorder.ondataavailable = e => chunks.push(e.data);
//       recorder.onstop = () => {
//         const audioBlob = new Blob(chunks, { type: 'audio/webm' });
//         setRecordedAudio(audioBlob);
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);
//     } catch (err) {
//       alert("Microphone access denied or not available.");
//       console.error(err);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     const token = localStorage.getItem('token');
//     const data = new FormData();
//     Object.entries(formData).forEach(([key, val]) => {
//       if (key !== 'audioUrl' && val) data.append(key, val);
//     });

//     if (recordedAudio) {
//       const file = new File([recordedAudio], "recording.webm", { type: "audio/webm" });
//       data.append("audioUrl", file);
//     } else if (formData.audioUrl) {
//       data.append("audioUrl", formData.audioUrl);
//     }

//     try {
//       await axios.post(`${API_BASE_URL}/lesson`, data, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setMessage('✅ Lesson created successfully');
//       setFormData({ title: '', description: '', language: '', imageUrl: null, audioUrl: null, videoUrl: null });
//       setRecordedAudio(null);
//       fetchLessons();
//     } catch (err) {
//       console.error(err);
//       setMessage(err.response?.data?.message || 'Error creating lesson');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this lesson?")) return;
//     setDeletingId(id);
//     const token = localStorage.getItem('token');
//     try {
//       await axios.delete(`${API_BASE_URL}/lesson/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchLessons();
//     } catch (err) {
//       console.error("Delete failed:", err);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const mediaUrl = (relativePath) => {
//     if (!relativePath || relativePath === 'null') return null;
//     return `http://hub.go237.com:2037${relativePath}`;
//   };

//   return (
//     <div style={{ padding: '30px' }}>
//       <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>📘 Lessons</h2>

//       <form
//         onSubmit={handleSubmit}
//         style={{
//           background: '#fff',
//           padding: '20px',
//           borderRadius: '8px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//           maxWidth: '700px',
//           margin: '0 auto 40px'
//         }}
//       >
//         <h3 style={{ marginBottom: '15px' }}>Add New Lesson</h3>
//         <input type="text" name="title" placeholder="Lesson title" value={formData.title} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }} />
//         <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }}></textarea>
//         <select name="language" value={formData.language} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }}>
//           <option value="">Select Language</option>
//           {languages.map(lang => (
//             <option key={lang._id} value={lang._id}>{lang.name}</option>
//           ))}
//         </select>
//         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
//           <div style={{ flex: 1 }}>
//             <label>Image:</label>
//             <input type="file" name="imageUrl" accept="image/*" onChange={handleChange} style={{ width: '100%' }} />
//           </div>
//           <div style={{ flex: 1 }}>
//             <label>Audio:</label>
//             {!isRecording && !recordedAudio && (
//               <>
//                 <input type="file" name="audioUrl" accept="audio/*" onChange={handleChange} style={{ width: '100%' }} />
//                 <button type="button" onClick={startRecording} style={{ marginTop: '5px', padding: '6px 10px' }}>🎙️ Record</button>
//               </>
//             )}
//             {isRecording && (
//               <p style={{ color: 'red', fontWeight: 'bold' }}>🔴 Recording... <button type="button" onClick={stopRecording} style={{ marginLeft: '10px', color: '#fff', backgroundColor: 'red', padding: '5px 10px' }}>Stop</button></p>
//             )}
//             {recordedAudio && (
//               <div style={{ marginTop: '10px' }}>
//                 <audio controls src={URL.createObjectURL(recordedAudio)} style={{ width: '100%' }} />
//                 <button type="button" onClick={() => setRecordedAudio(null)} style={{ marginTop: '5px', padding: '5px 10px', backgroundColor: '#f87171', color: '#fff' }}>
//                   ❌ Discard Recording
//                 </button>
//               </div>
//             )}
//           </div>
//           <div style={{ flex: 1 }}>
//             <label>Video:</label>
//             <input type="file" name="videoUrl" accept="video/*" onChange={handleChange} style={{ width: '100%' }} />
//           </div>
//         </div>
//         <button type="submit" disabled={loading} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px' }}>
//           {loading ? <ImSpinner2 className="spinner-icon" /> : 'Add Lesson'}
//         </button>
//         {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
//       </form>

//       <div style={{ marginBottom: '15px' }}>
//         <input
//           type="text"
//           placeholder="Search lessons..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{ width: '300px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
//         />
//       </div>

//       <h3 style={{ marginBottom: '15px' }}>Available Lessons</h3>
//       <div style={{ overflowX: 'auto' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
//           <thead>
//             <tr style={{ background: '#f3f4f6' }}>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Title</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Description</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Language</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Image</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Audio</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Video</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredLessons.map(lesson => (
//               <tr key={lesson._id}>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{lesson.title}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{lesson.description}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{lesson.language?.name || 'N/A'}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{mediaUrl(lesson.imageUrl) && <img src={mediaUrl(lesson.imageUrl)} alt="lesson-img" style={{ width: '50px' }} />}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{mediaUrl(lesson.audioUrl) && <audio controls src={mediaUrl(lesson.audioUrl)} style={{ width: '100px' }} />}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{mediaUrl(lesson.videoUrl) && <video width="100" controls src={mediaUrl(lesson.videoUrl)} />}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
//                   <button onClick={() => handleDelete(lesson._id)} disabled={deletingId === lesson._id} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
//                     {deletingId === lesson._id ? <ImSpinner2 className="spinner-icon" /> : <FaTrash />}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Lessons;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { FaTrash } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
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

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/lesson`);
      setLessons(res.data);
      setFilteredLessons(res.data);
    } catch (err) {
      console.error('Failed to load lessons:', err);
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

  useEffect(() => {
    fetchLessons();
    fetchLanguages();
  }, []);

  useEffect(() => {
    const filtered = lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLessons(filtered);
    setCurrentPage(1);
  }, [searchQuery, lessons]);

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
      await axios.post(`${API_BASE_URL}/lesson`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('✅ Lesson created successfully');
      setFormData({ title: '', description: '', language: '', imageUrl: null, audioUrl: null, videoUrl: null });
      setRecordedAudio(null);
      fetchLessons();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error creating lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    setDeletingId(id);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/lesson/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLessons();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const mediaUrl = (relativePath) => {
    if (!relativePath || relativePath === 'null') return null;
    return `http://hub.go237.com:2037${relativePath}`;
  };

  const paginatedLessons = filteredLessons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>📘 Lessons</h2>

      <form
        onSubmit={handleSubmit}
        style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxWidth: '700px', margin: '0 auto 40px' }}
      >
        <h3 style={{ marginBottom: '15px' }}>Add New Lesson</h3>
        <input type="text" name="title" placeholder="Lesson title" value={formData.title} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }}></textarea>
        <select name="language" value={formData.language} onChange={handleChange} required style={{ marginBottom: '10px', padding: '10px', width: '100%' }}>
          <option value="">Select Language</option>
          {languages.map(lang => (
            <option key={lang._id} value={lang._id}>{lang.name}</option>
          ))}
        </select>
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
          {loading ? <ImSpinner2 className="spinner-icon" /> : 'Add Lesson'}
        </button>
        {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
      </form>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      <h3 style={{ marginBottom: '15px' }}>Available Lessons</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Description</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Language</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Image</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Audio</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Video</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLessons.map(lesson => (
              <tr key={lesson._id}>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  {lesson.title}<br />
                  <small style={{ color: '#6b7280' }}>
                    {lesson.createdBy?.username} ({lesson.createdBy?.email})<br />
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </small>
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{lesson.description}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{lesson.language?.name || 'N/A'}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{mediaUrl(lesson.imageUrl) && <img src={mediaUrl(lesson.imageUrl)} alt="lesson-img" style={{ width: '50px' }} />}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{mediaUrl(lesson.audioUrl) && <audio controls src={mediaUrl(lesson.audioUrl)} style={{ width: '100px' }} />}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{mediaUrl(lesson.videoUrl) && <video width="100" controls src={mediaUrl(lesson.videoUrl)} />}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  <button onClick={() => handleDelete(lesson._id)} disabled={deletingId === lesson._id} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                    {deletingId === lesson._id ? <ImSpinner2 className="spinner-icon" /> : <FaTrash />}
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
              style={{
                margin: '0 5px',
                padding: '6px 12px',
                backgroundColor: currentPage === page ? '#3b82f6' : '#e5e7eb',
                color: currentPage === page ? '#fff' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
