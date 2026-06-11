import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Pill, Download, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions/my');
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefill = async (id) => {
    try {
      await api.post(`/prescriptions/${id}/refill`);
      toast.success('Refill request submitted successfully');
      loadPrescriptions();
    } catch (error) {
      toast.error('Failed to submit refill request');
    }
  };

  const handleDownload = (prescription) => {
    // In production, generate PDF
    toast.success('Download started');
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      filled: 'bg-blue-100 text-blue-700',
      expired: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Clock size={14} className="inline mr-1" />;
      case 'filled': return <CheckCircle size={14} className="inline mr-1" />;
      case 'cancelled': return <XCircle size={14} className="inline mr-1" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">My Prescriptions</h1>
        </div>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Pill size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">No prescriptions found</h3>
            <p className="text-gray-500">Your prescriptions will appear here once issued by a doctor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 text-lg">{prescription.medication_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Prescribed by Dr. {prescription.doctor_name} • {new Date(prescription.issued_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(prescription.status)}`}>
                    {getStatusIcon(prescription.status)}
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Dosage</p>
                    <p className="font-medium">{prescription.dosage}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Frequency</p>
                    <p className="font-medium">{prescription.frequency}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{prescription.duration}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-medium">{prescription.quantity} {prescription.refills > 0 ? `(+${prescription.refills} refills)` : ''}</p>
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-xs text-amber-700 font-medium mb-1">Instructions</p>
                    <p className="text-sm text-amber-800">{prescription.instructions}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDownload(prescription)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-brand-600 transition"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  {prescription.status === 'active' && (
                    <button
                      onClick={() => handleRefill(prescription.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                    >
                      <RefreshCw size={16} />
                      Request Refill
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPrescriptions;