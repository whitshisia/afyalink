import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Mail, Copy, CheckCircle, Lock, UserPlus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ShareRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareExpiry, setShareExpiry] = useState(7);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadRecord();
  }, [id]);

  const loadRecord = async () => {
    try {
      const response = await api.get(`/records/${id}`);
      setRecord(response.data);
    } catch (error) {
      console.error('Failed to load record:', error);
      toast.error('Failed to load record');
      navigate('/records');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setSharing(true);
    try {
      const response = await api.post(`/records/${id}/share`, {
        email: shareEmail,
        expiry_days: shareExpiry
      });
      
      toast.success(`Record shared with ${shareEmail}`);
      setShareEmail('');
    } catch (error) {
      console.error('Share failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to share record');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/share/${id}`;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">Share Medical Record</h1>
          <p className="text-gray-500 mt-2">Securely share your medical records with healthcare providers</p>
        </div>

        {/* Record Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Record Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Title</span>
              <span className="font-medium">{record?.title}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Type</span>
              <span className="font-medium capitalize">{record?.record_type?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{new Date(record?.record_date).toLocaleDateString()}</span>
            </div>
            {record?.description && (
              <div className="py-2">
                <span className="text-gray-500">Description</span>
                <p className="text-gray-700 mt-1">{record.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Share Options</h2>
          
          {/* Share by Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share with Healthcare Provider
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <select
                value={shareExpiry}
                onChange={(e) => setShareExpiry(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              >
                <option value={1}>1 day</option>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
              </select>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <UserPlus size={18} />
                {sharing ? 'Sharing...' : 'Share'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              The recipient will receive an email with access to view this record
            </p>
          </div>

          {/* Shareable Link */}
          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shareable Link
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={`${window.location.origin}/share/${id}`}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              >
                {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Anyone with this link can view this record. Link expires in {shareExpiry} days.
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-start gap-3">
            <Lock size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Secure Sharing</p>
              <p className="text-xs text-green-600 mt-1">
                All shared records are encrypted and access is logged. You can revoke access at any time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate('/records')}
            className="text-gray-500 hover:text-gray-700"
          >
            Back to Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareRecord;