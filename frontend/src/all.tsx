import { useState, useEffect } from 'react';
import { Upload, File, Activity, LogOut, Search, Filter } from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import AuthForms from './authform';

const host = import.meta.env.VITE_BASE_URL || 'http://backend:7322'

const API_BASE = `${host}/api`;

export type FileType = {
  id: string;
  originalName?: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  permissionLevel: string;
  tags?: string[];
  owner_email?: string;
  createdAt: string;
  ownerId?: string;
  // add any other properties you use
};

export type AuditLogType = {
  id: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  createdAt: string;
  details?: any;
  userId?: string;
  ipAddress?: string;
  // add any other properties you use
};

const FileShareApp = () => {
  const [user, setUser] = useState<{ id: string, email: string, role: { name: string } } | null>(null);  
  const [token, setToken] = useState<string|null>(localStorage.getItem('token'));
  const [socket, setSocket] = useState<Socket | null>(null);
  const [files, setFiles] = useState([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);  
  const [notifications, setNotifications] = useState<{ id: number, message: string, type: string }[]>([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', role: 'employee' });
  const [fileFilters, setFileFilters] = useState({ search: '', permissionLevel: '', page: 1, limit: 10 });
  const [uploadData, setUploadData] = useState<{file: File |null, permissionLevel: string, tags: string }>({ file: null, permissionLevel: 'private', tags: '' });

  const [editFileModal, setEditFileModal] = useState<{open: boolean, file: FileType | null}>({ open: false, file: null });
  const [editFileData, setEditFileData] = useState({ originalName: '', permissionLevel: '', tags: '' });
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  // Initialize user from token
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Socket connection
useEffect(() => {
  if (user && token) {
    const newSocket = io(host, { auth: { token } });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      addNotification('Socket connection error: ' + err.message, 'error');
    });

    newSocket.on('connected', (data) => {
      console.log('Connected to server:', data);
      addNotification('Connected to server', 'success');
    });

    newSocket.on('new-admin-file', (data) => {
      console.log("NEw admin file");
      addNotification(`New file uploaded: ${data.filename}`, 'info');
      fetchFiles();
    });

    newSocket.on('admin-file-update', (data) => {
      console.log("NEw admin file update");
      addNotification(`File metadata updated: ${data.filename}`, 'info');
      fetchFiles();
    });

    setSocket(newSocket);
    // Only disconnect the socket created by this effect
    return () => {
      newSocket.disconnect();
    };
  }
}, [user, token]);



  const addNotification = (message: string, type: string = 'info') => {
    const id = Date.now();
    setNotifications((prev: { id: number, message: string, type: string }[]) => {
      // Always return an array of the same type as the state
      if (Array.isArray(prev)) {
        return [...prev, { id, message, type }];
      }
      return [{ id, message, type }];
    });
    setTimeout(() => {
      setNotifications(prev => {
        if (Array.isArray(prev)) {
          const filtered = prev.filter(n => n.id !== id);
          // If filtered is empty, return [] to match state type
          return filtered.length > 0 ? filtered : [];
        }
        return [];
      });
    }, 5000);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        fetchFiles();
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout();
    }
  };

  const login = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();
      
      if (response.ok) {
        setToken(data.accessToken);
        localStorage.setItem('token', data.accessToken);
        console.log("dataaaaaa",data)
        setUser(data.user);
        addNotification('Login successful!', 'success');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      const data = await response.json();
      
      if (response.ok) {
        addNotification('Registration successful! Please login.', 'success');
        setRegisterForm({ email: '', password: '', role: 'employee' });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setFiles([]);
    setAuditLogs([]);
  };

  const fetchFiles = async () => {
    if (!token) return;

    try {
      const params = new URLSearchParams({
        page: fileFilters.page.toString(),
        limit: fileFilters.limit.toString(),
        ...(fileFilters.search && { search: fileFilters.search }),
        ...(fileFilters.permissionLevel && { permissionLevel: fileFilters.permissionLevel })
      });

      const response = await fetch(`${API_BASE}/files?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || data);
      }
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  };

  const uploadFile = async () => {
    if (!uploadData.file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('permissionLevel', uploadData.permissionLevel);
    if (uploadData.tags) {
      formData.append('tags', JSON.stringify(uploadData.tags.split(',').map(t => t.trim())));
    }

    try {
      const response = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        addNotification('File uploaded successfully!', 'success');
        setUploadData({ file: null, permissionLevel: 'private', tags: '' });
        fetchFiles();
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
      } else {
        const data = await response.json();
        setError(data.message || 'Upload failed');
      }
    } catch  {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    if (!token || user?.role.name !== 'admin') return;

    try {
      const response = await fetch(`${API_BASE}/audit`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`${API_BASE}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        addNotification('File deleted successfully!', 'success');
        fetchFiles();
      } else {
        setError('Failed to delete file');
      }
    } catch {
      setError('Failed to delete file');
    }
  };

    const updateFile = async (fileId: string, updates: any) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        addNotification('File updated successfully!', 'success');
        fetchFiles();
        setEditFileModal({ open: false, file: null });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update file');
      }
    } catch  {
      setError('Failed to update file');
    } finally {
      setLoading(false);
    }
  };

   const viewFile = async (fileId: string) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedFile(data);
      } else {
        setError('Failed to fetch file details');
      }
    } catch {
      setError('Failed to fetch file details');
    } finally {
      setLoading(false);
    }
  };


if (!user) {
    return (
      <AuthForms
        error={error}
        loading={loading}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        login={login}
        register={register}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-3 rounded-md shadow-lg ${
              notif.type === 'success' ? 'bg-green-100 text-green-800' :
              notif.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Edit File Modal */}
      {editFileModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Edit File</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Original Name"
                value={editFileData.originalName}
                onChange={e => setEditFileData({ ...editFileData, originalName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={editFileData.permissionLevel}
                onChange={e => setEditFileData({ ...editFileData, permissionLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={editFileData.tags}
                onChange={e => setEditFileData({ ...editFileData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditFileModal({ open: false, file: null })}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() =>{
                  if (editFileModal.file) {
                    updateFile(editFileModal.file.id, {
                      originalName: editFileData.originalName,
                      permissionLevel: editFileData.permissionLevel,
                      tags: editFileData.tags.split(',').map(t => t.trim()).filter(Boolean),
                    });
                  }
                }
                }
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


    {/* View File Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">{selectedFile.originalName || selectedFile.filename}</h3>
            <p><b>Filename:</b> {selectedFile.filename}</p>
            <p><b>Size:</b> {selectedFile.fileSize} bytes</p>
            <p><b>Type:</b> {selectedFile.mimeType}</p>
            <p><b>Permission:</b> {selectedFile.permissionLevel}</p>
            <p><b>Tags:</b> {(selectedFile.tags || []).join(', ')}</p>
            <p><b>Owner:</b> {selectedFile.owner_email}</p>
            <p><b>Created:</b> {new Date(selectedFile.createdAt).toLocaleString()}</p>
            <button
              onClick={() => setSelectedFile(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">File Sharing Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.email} ({user.role.name})</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* File Upload */}
          {['admin', 'manager', 'employee'].includes(user.role.name) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} />
                Upload File
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select File
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      onChange={(e) => {
                        const files = e.target.files;
                        setUploadData({ ...uploadData, file: files && files[0] ? files[0] : null });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permission Level
                    </label>
                    <select
                      value={uploadData.permissionLevel}
                      onChange={(e) => setUploadData({...uploadData, permissionLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="private">Private</option>
                      <option value="shared">Shared</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="important, project"
                      value={uploadData.tags}
                      onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={uploadFile}
                  disabled={loading || !uploadData.file}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </div>
          )}

          {/* File Filters */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Filter size={20} />
              File Filters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search files..."
                value={fileFilters.search}
                onChange={(e) => setFileFilters({...fileFilters, search: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={fileFilters.permissionLevel}
                onChange={(e) => setFileFilters({...fileFilters, permissionLevel: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Permissions</option>
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
              <input
                type="number"
                placeholder="Page"
                value={fileFilters.page}
                onChange={(e) => setFileFilters({...fileFilters, page: parseInt(e.target.value) || 1})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <button
                onClick={fetchFiles}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Search size={16} />
                Apply Filters
              </button>
            </div>
          </div>

        {/* Files List */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <File size={20} />
            Files
          </h2>
          {files.length === 0 ? (
            <p className="text-gray-500">No files found.</p>
          ) : (
            <div className="space-y-4">
              {files.map((file: FileType) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{file.originalName || file.filename}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {(file.fileSize / 1024 / 1024).toFixed(2)} MB | 
                        Permission: {file.permissionLevel} | 
                        Type: {file.mimeType}
                      </p>
                      {file.tags && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(Array.isArray(file.tags) ? file.tags : JSON.parse(file.tags || '[]')).map((tag: string, idx: number) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(file.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => {
                          setEditFileModal({
                            open: true,
                            file
                          });
                          setEditFileData({
                            originalName: file.originalName || file.filename,
                            permissionLevel: file.permissionLevel,
                            tags: Array.isArray(file.tags) ? file.tags.join(', ') : (file.tags || ''),
                          });
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => viewFile(file.id)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded hover:bg-gray-300"
                      >
                        View
                      </button>
                      {(user.role.name === 'admin' || file.ownerId === user.id) && (
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Audit Logs (Admin only) */}
          {user.role.name === 'admin' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Activity size={20} />
                  Audit Logs
                </h2>
                <button
                  onClick={fetchAuditLogs}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Refresh Logs
                </button>
              </div>
              {auditLogs.length === 0 ? (
                <p className="text-gray-500">No audit logs found.</p>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log) => {
                    return (<div key={log.id} className="border border-gray-200 rounded p-3 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{log.action}</span> on {log.resourceType}
                          {log.resourceId && ` (ID: ${log.resourceId})`}
                        </div>
                        <span className="text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-gray-600 mt-1">{JSON.stringify(log.details)}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        User ID: {log.userId} | IP: {log.ipAddress}
                      </p>
                    </div>)
})}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FileShareApp;