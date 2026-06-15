import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pill, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { saveOfflineMessage } from '../../services/indexedDB';

const RequestRefill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pharmacy_name: '',
    delivery_address: '',
    notes: ''
  });

  useEffect(() => {
    loadPrescription();
  }, [id]);

  const loadPrescription = async () => {
    try {
      const response = await api.get(`/prescriptions/${id}`);
      setPrescription(response.data);
    } catch (error) {
      console.error('Failed to load prescription:', error);
      toast.error('Failed to load prescription');
      navigate('/prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pharmacy_name || !formData.delivery_address) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    const refillData = {
      prescription_id: id,
      pharmacy_name: formData.pharmacy_name,
      delivery_address: formData.delivery_address,
      notes: formData.notes
    };

    try {
      const response = await api.post('/prescriptions/refill', refillData);
      toast.success('Refill request submitted successfully!');
      navigate('/prescriptions');
    } catch (error) {
      console.error('Refill request failed:', error);
      
      if (!navigator.onLine) {
        await saveOfflineMessage({
          type: 'prescription_refill',
          data: refillData
        });
        toast.success('Request saved offline. Will submit when you\'re back online.');
        navigate('/prescriptions');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to submit refill request');
      }
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="font-display text-3xl font-bold text-gray-900">Request Prescription Refill</h1>
          <p className="text-gray-500 mt-2">Submit a refill request for your medication</p>
        </div>

        {/* Prescription Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
              <Pill size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-gray-900">{prescription?.medication_name}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Dosage:</span>
                  <span className="ml-2 text-gray-700">{prescription?.dosage}</span>
                </div>
                <div>
                  <span className="text-gray-500">Frequency:</span>
                  <span className="ml-2 text-gray-700">{prescription?.frequency}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 text-gray-700">{prescription?.duration}</span>
                </div>
                <div>
                  <span className="text-gray-500">Refills left:</span>
                  <span className="ml-2 text-gray-700">{prescription?.refills}</span>
                </div>
              </div>
              {prescription?.instructions && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Instructions:</p>
                  <p className="text-sm text-gray-700 mt-1">{prescription.instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Refill Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Refill Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pharmacy Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pharmacy_name"
              value={formData.pharmacy_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              placeholder="e.g., Goodlife Pharmacy - Westlands"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              placeholder="Enter your full delivery address"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              placeholder="Any special instructions or notes for the pharmacist..."
            />
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-amber-50 rounded-lg p-4 border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Refill Notice</p>
                <p className="text-xs text-amber-600 mt-1">
                  Please allow 2-3 business days for processing and delivery. You will receive a confirmation once your refill is ready.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/prescriptions')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Refill Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestRefill;