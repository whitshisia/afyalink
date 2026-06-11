export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const APP_CONFIG = {
  name: 'AfyaLink',
  version: '1.0.0',
  company: 'AfyaLink Technologies Ltd',
  email: 'hello@afyalink.com',
  phone: '+254 700 000 000',
  address: 'Nairobi, Kenya'
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

export const APPOINTMENT_TYPES = {
  IN_PERSON: 'in_person',
  VIDEO: 'video',
  PHONE: 'phone'
};

export const RECORD_TYPES = {
  LAB_RESULT: 'lab_result',
  RADIOLOGY: 'radiology',
  PRESCRIPTION: 'prescription',
  DISCHARGE_SUMMARY: 'discharge_summary',
  SURGERY_REPORT: 'surgery_report',
  VACCINATION: 'vaccination',
  GENERAL: 'general'
};

export const PRESCRIPTION_STATUS = {
  ACTIVE: 'active',
  FILLED: 'filled',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash'
};

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
};

export const BLOOD_TYPES = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-'
};