import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Upload, Download, Share2, Trash2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { cacheMedicalRecord, getCachedMedicalRecord } from '../../services/indexedDB';

const MyRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    record_type: 'general',
    description: '',
    record_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const response = await api.get('/records/patient/me');
      setRecords(response.data);
      
      // Cache records for offline access
      response.data.forEach(record => {
        cacheMedicalRecord(record.id, record);
      });
    } catch (error) {
      console.error('Failed to load records:', error);
      toast.error('Failed to load medical records');
      
      // Try to load from cache if offline
      if (!navigator.onLine) {
        toast('You are offline. Showing cached records.', { icon: '📱' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a PDF or image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadForm.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadForm.title);
    formData.append('record_type', uploadForm.record_type);
    formData.append('description', uploadForm.description);
    formData.append('record_date', uploadForm.record_date);

    try {
      const response = await api.post('/records/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Record uploaded successfully');
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadForm({
        title: '',
        record_type: 'general',
        description: '',
        record_date: new Date().toISOString().split('T')[0]
      });
      loadRecords();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (record) => {
    if (record.file_url) {
      window.open(record.file_url, '_blank');
    } else {
      toast.error('No file available for download');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/records/${id}`);
        toast.success('Record deleted successfully');
        loadRecords();
      } catch (error) {
        toast.error('Failed to delete record');
      }
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (record.description && record.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || record.record_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getRecordTypeBadge = (type) => {
    const badges = {
      lab_result: 'bg-blue-100 text-blue-700',
      radiology: 'bg-purple-100 text-purple-700',
      prescription: 'bg-green-100 text-green-700',
      discharge_summary: 'bg-orange-100 text-orange-700',
      surgery_report: 'bg-red-100 text-red-700',
      vaccination: 'bg-teal-100 text-teal-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return badges[type] || 'bg-gray-100 text-gray-700';
  };

  const getRecordTypeLabel = (type) => {
    const labels = {
      lab_result: 'Lab Result',
      radiology: 'Radiology',
      prescription: 'Prescription',
      discharge_summary: 'Discharge Summary',
      surgery_report: 'Surgery Report',
      vaccination: 'Vaccination',
      general: 'General'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">Medical Records</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition flex items-center gap-2"
          >
            <Upload size={18} />
            Upload Record
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Types</option>
              <option value="lab_result">Lab Results</option>
              <option value="radiology">Radiology</option>
              <option value="prescription">Prescriptions</option>
              <option value="discharge_summary">Discharge Summaries</option>
              <option value="surgery_report">Surgery Reports</option>
              <option value="vaccination">Vaccinations</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-500 mb-4">Upload your first medical record to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-brand-600 hover:text-brand-700 font-medium"
            >
              Upload Record →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-gray-900">{record.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRecordTypeBadge(record.record_type)}`}>
                          {getRecordTypeLabel(record.record_type)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(record.record_date).toLocaleDateString()}
                        </span>
                        {record.file_size && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {(record.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </>
                        )}
                      </div>
                      {record.description && (
                        <p className="text-sm text-gray-500 mt-2">{record.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.file_url && (
                      <button
                        onClick={() => handleDownload(record)}
                        className="p-2 text-gray-500 hover:text-brand-600 transition"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-xl font-bold text-gray-900">Upload Medical Record</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g., Blood Test Results - Jan 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                  <select
                    value={uploadForm.record_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, record_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="general">General</option>
                    <option value="lab_result">Lab Result</option>
                    <option value="radiology">Radiology</option>
                    <option value="prescription">Prescription</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="surgery_report">Surgery Report</option>
                    <option value="vaccination">Vaccination</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    placeholder="Additional notes about this record..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Record Date</label>
                  <input
                    type="date"
                    value={uploadForm.record_date}
                    onChange={(e) => setUploadForm({ ...uploadForm, record_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG. Max size: 10MB</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile || !uploadForm.title}
                    className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecords;