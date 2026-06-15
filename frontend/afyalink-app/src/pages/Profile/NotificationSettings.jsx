import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Calendar, MessageSquare, Pill, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    appointment_reminders: true,
    appointment_confirmation: true,
    prescription_refill: true,
    medical_record_updates: true,
    promotional_emails: false,
    reminder_time: 60 // minutes before appointment
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/users/me/notifications');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      // Use default settings
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleReminderTimeChange = (e) => {
    setSettings({
      ...settings,
      reminder_time: parseInt(e.target.value)
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/me/notifications', settings);
      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-500 mt-2">Manage how you receive updates and reminders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Notification Channels */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-display text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notification Channels
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('email_notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.email_notifications ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">SMS Notifications</p>
                    <p className="text-xs text-gray-500">Receive text message alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('sms_notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.sms_notifications ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Push Notifications</p>
                    <p className="text-xs text-gray-500">In-app and browser notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('push_notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.push_notifications ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.push_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">What to Notify Me About</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Appointment Reminders</p>
                    <p className="text-xs text-gray-500">Get reminded before your appointments</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('appointment_reminders')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.appointment_reminders ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.appointment_reminders ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Appointment Confirmations</p>
                    <p className="text-xs text-gray-500">Confirmations when appointments are booked</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('appointment_confirmation')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.appointment_confirmation ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.appointment_confirmation ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pill size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Prescription Refill Reminders</p>
                    <p className="text-xs text-gray-500">Get notified when it's time to refill</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('prescription_refill')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.prescription_refill ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.prescription_refill ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700">Medical Record Updates</p>
                    <p className="text-xs text-gray-500">When new records are added</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('medical_record_updates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    settings.medical_record_updates ? 'bg-brand-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.medical_record_updates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Reminder Timing */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-display text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Reminder Timing
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send reminders
              </label>
              <select
                value={settings.reminder_time}
                onChange={handleReminderTimeChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              >
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
                <option value={120}>2 hours before</option>
                <option value={1440}>1 day before</option>
              </select>
            </div>
          </div>

          {/* Marketing Preferences */}
          <div className="p-6">
            <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">Marketing Preferences</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Promotional Emails</p>
                <p className="text-xs text-gray-500">Receive updates about new features and offers</p>
              </div>
              <button
                onClick={() => handleToggle('promotional_emails')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.promotional_emails ? 'bg-brand-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.promotional_emails ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;