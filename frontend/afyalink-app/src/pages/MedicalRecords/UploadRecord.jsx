import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { saveOfflineMessage } from '../../services/indexedDB';

const UploadRecord = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    record_type: 'general',
    description: '',
    record_date: new Date().toISOString().split('T')[0]
  });
  const [dragActive, setDragActive] = useState(false);

  const recordTypes = [
    { value: 'lab_result', label: 'Lab Result' },
    { value: 'radiology', label: 'Radiology/Imaging' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'discharge_summary', label: 'Discharge Summary' },
    { value: 'surgery_report', label: 'Surgery Report' },
    { value: 'vaccination', label: 'Vaccination Record' },
    { value: 'general', label: 'General' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', selectedFile);
    uploadData.append('title', formData.title);
    uploadData.append('record_type', formData.record_type);
    uploadData.append('description', formData.description);
    uploadData.append('record_date', formData.record_date);

    try {
      const response = await api.post('/records/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Record uploaded successfully!');
      navigate('/records');
    } catch (error) {
      console.error('Upload failed:', error);
      
      if (!navigator.onLine) {
        // Save for offline sync
        await saveOfflineMessage({
          type: 'record_upload',
          data: {
            title: formData.title,
            record_type: formData.record_type,
            description: formData.description,
            record_date: formData.record_date,
            file_name: selectedFile.name,
            file_size: selectedFile.size
          }
        });
        toast.success('Record saved offline. Will upload when you\'re back online.');
        navigate('/records');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to upload record');
      }
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">Upload Medical Record</h1>
          <p className="text-gray-500 mt-2">Add a new document to your medical records</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="e.g., Blood Test Results - January 2025"
              required
            />
          </div>

          {/* Record Type */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Record Type
            </label>
            <select
              name="record_type"
              value={formData.record_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            >
              {recordTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              placeholder="Additional notes about this record..."
            />
          </div>

          {/* Record Date */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Record Date
            </label>
            <input
              type="date"
              name="record_date"
              value={formData.record_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            
            {!selectedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300'
                }`}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Drag and drop your file here, or click to select</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg cursor-pointer hover:bg-brand-700 transition"
                >
                  Select File
                </label>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-brand-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/records')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Record
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Important Information</p>
              <p className="text-xs text-blue-600 mt-1">
                Your medical records are encrypted and stored securely. Only you and your authorized healthcare providers can access them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRecord;