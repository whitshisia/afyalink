import { openDB } from 'idb';

const DB_NAME = 'AfyaLinkDB';
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Store for offline appointments
    if (!db.objectStoreNames.contains('offlineAppointments')) {
      const appointmentStore = db.createObjectStore('offlineAppointments', { 
        keyPath: 'id', 
        autoIncrement: true 
      });
      appointmentStore.createIndex('createdAt', 'createdAt');
    }

    // Store for cached medical records
    if (!db.objectStoreNames.contains('cachedRecords')) {
      const recordStore = db.createObjectStore('cachedRecords', { 
        keyPath: 'id' 
      });
      recordStore.createIndex('patientId', 'patientId');
      recordStore.createIndex('cachedAt', 'cachedAt');
    }

    // Store for offline messages/notifications
    if (!db.objectStoreNames.contains('offlineMessages')) {
      const messageStore = db.createObjectStore('offlineMessages', { 
        keyPath: 'id', 
        autoIncrement: true 
      });
      messageStore.createIndex('timestamp', 'timestamp');
      messageStore.createIndex('synced', 'synced');
    }

    // Store for user preferences (offline)
    if (!db.objectStoreNames.contains('userPreferences')) {
      db.createObjectStore('userPreferences', { keyPath: 'key' });
    }
  },
});

// Save appointment for offline sync
export async function saveOfflineAppointment(appointmentData) {
  const db = await dbPromise;
  return db.add('offlineAppointments', {
    data: appointmentData,
    createdAt: new Date().toISOString(),
    synced: false
  });
}

// Get all offline appointments
export async function getOfflineAppointments() {
  const db = await dbPromise;
  return db.getAllFromIndex('offlineAppointments', 'createdAt');
}

// Delete synced appointment
export async function deleteSyncedAppointment(id) {
  const db = await dbPromise;
  return db.delete('offlineAppointments', id);
}

// Cache medical record
export async function cacheMedicalRecord(recordId, recordData) {
  const db = await dbPromise;
  return db.put('cachedRecords', {
    id: recordId,
    data: recordData,
    cachedAt: new Date().toISOString()
  });
}

// Get cached medical record
export async function getCachedMedicalRecord(recordId) {
  const db = await dbPromise;
  return db.get('cachedRecords', recordId);
}

// Get all cached records for patient
export async function getCachedRecordsForPatient(patientId) {
  const db = await dbPromise;
  const records = await db.getAllFromIndex('cachedRecords', 'patientId', patientId);
  return records;
}

// Save user preference
export async function saveUserPreference(key, value) {
  const db = await dbPromise;
  return db.put('userPreferences', { key, value });
}

// Get user preference
export async function getUserPreference(key) {
  const db = await dbPromise;
  const result = await db.get('userPreferences', key);
  return result?.value;
}

// Save offline message (for later sync)
export async function saveOfflineMessage(messageData) {
  const db = await dbPromise;
  return db.add('offlineMessages', {
    data: messageData,
    timestamp: new Date().toISOString(),
    synced: false
  });
}

// Get unsynced messages
export async function getUnsyncedMessages() {
  const db = await dbPromise;
  return db.getAllFromIndex('offlineMessages', 'synced', false);
}

// Mark message as synced
export async function markMessageSynced(id) {
  const db = await dbPromise;
  const message = await db.get('offlineMessages', id);
  if (message) {
    message.synced = true;
    return db.put('offlineMessages', message);
  }
}