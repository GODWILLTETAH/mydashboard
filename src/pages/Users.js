// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../config';
// import { FaUserPlus, FaTrash } from 'react-icons/fa';
// import { ImSpinner2 } from 'react-icons/im';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [formData, setFormData] = useState({
//     username: '',
//     contact: '',
//     email: '',
//     password: '',
//     role: 'user',
//   });
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/users`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data);
//       setFilteredUsers(res.data);
//     } catch (err) {
//       console.error('Failed to load users:', err);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const filtered = users.filter((user) =>
//       user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.contact?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [searchQuery, users]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage(`✅ ${res.data?.message || 'User created successfully'}`);
//       setFormData({ username: '', contact: '', email: '', password: '', role: 'user' });
//       fetchUsers();
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Error creating user');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     setDeletingId(id);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API_BASE_URL}/users/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error('Delete failed:', err);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div style={{ padding: '30px' }}>
//       <h2 style={{ marginBottom: '25px', fontSize: '24px', color: '#1f2937' }}>👥 User Management</h2>

//       <form onSubmit={handleRegister} style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '600px', marginBottom: '40px' }}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
//           <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
//           <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
//           <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
//           <select name="role" value={formData.role} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
//             <option value="superAdmin">Super Admin</option>
//             <option value="admin">Admin</option>
//             <option value="user">User</option>
//           </select>

//           <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
//             {loading ? <ImSpinner2 className="spinner-icon" /> : <><FaUserPlus /> Register User</>}
//           </button>

//           {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : '#dc2626' }}>{message}</p>}
//         </div>
//       </form>

//       <div style={{ marginBottom: '15px' }}>
//         <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
//       </div>

//       <h3 style={{ marginBottom: '15px' }}>Registered Users</h3>
//       <div style={{ overflowX: 'auto' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
//           <thead>
//             <tr style={{ background: '#f3f4f6' }}>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Username</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Email</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Contact</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Role</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Created</th>
//               <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map(user => (
//               <tr key={user._id}>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.username}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.email || '—'}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.contact || '—'}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.role}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
//                 <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
//                   <button onClick={() => handleDelete(user._id)} disabled={deletingId === user._id} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
//                     {deletingId === user._id ? <ImSpinner2 className="spinner-icon" /> : <FaTrash />}
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

// export default Users;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { FaUserPlus, FaTrash } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    contact: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.contact?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`✅ ${res.data?.message || 'User created successfully'}`);
      setFormData({ username: '', contact: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/profile`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '25px', fontSize: '24px', color: '#1f2937', textAlign: 'center' }}>👥 User Management</h2>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={handleRegister} style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '600px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <select name="role" value={formData.role} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
              <option value="superAdmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {loading ? <ImSpinner2 className="spinner-icon" /> : <><FaUserPlus /> Register User</>}
            </button>

            {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : '#dc2626' }}>{message}</p>}
          </div>
        </form>
      </div>

      <div style={{ margin: '30px 0 15px' }}>
        <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
      </div>

      <h3 style={{ marginBottom: '15px' }}>Registered Users ({filteredUsers.length})</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Profile</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Username</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Contact</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Role</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Subscribed</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Created</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user._id}>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  {user.profileImage && user.profileImage !== 'null' ? (
                    <img src={`http://hub.go237.com:2037${user.profileImage}`} alt="profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  ) : (
                    'None'
                  )}
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.username}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.email || '—'}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.contact || '—'}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}>
                    <option value="superAdmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{user.isSubscribed ? 'Yes' : 'No'}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                  <button onClick={() => handleDelete(user._id)} disabled={deletingId === user._id} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                    {deletingId === user._id ? <ImSpinner2 className="spinner-icon" /> : <FaTrash />}
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

export default Users;

