import { 
  getOfflineAppointments, 
  deleteSyncedAppointment,
  getUnsyncedMessages,
  markMessageSynced 
} from './indexedDB';
import api from './api';
import toast from 'react-hot-toast';

export async function syncOfflineData() {
  if (!navigator.onLine) {
    console.log('Offline: Cannot sync');
    return;
  }

  console.log('Starting offline data sync...');
  
  // Sync appointments
  await syncAppointments();
  
  // Sync messages
  await syncMessages();
  
  console.log('Offline sync completed');
}

async function syncAppointments() {
  const offlineAppointments = await getOfflineAppointments();
  
  for (const appointment of offlineAppointments) {
    if (!appointment.synced) {
      try {
        const response = await api.post('/appointments', appointment.data);
        
        if (response.status === 201) {
          await deleteSyncedAppointment(appointment.id);
          toast.success('Appointment synced successfully!');
        }
      } catch (error) {
        console.error('Failed to sync appointment:', error);
      }
    }
  }
}

async function syncMessages() {
  const unsyncedMessages = await getUnsyncedMessages();
  
  for (const message of unsyncedMessages) {
    if (!message.synced) {
      try {
        // Handle different message types
        switch (message.data.type) {
          case 'prescription_refill':
            await api.post('/prescriptions/refill', message.data);
            break;
          case 'record_upload':
            await api.post('/records/upload', message.data);
            break;
          default:
            console.log('Unknown message type:', message.data.type);
        }
        
        await markMessageSynced(message.id);
        toast.success('Message synced successfully!');
      } catch (error) {
        console.error('Failed to sync message:', error);
      }
    }
  }
}

// Listen for online/offline events
export function initOfflineSync() {
  window.addEventListener('online', () => {
    toast.success('You are back online! Syncing your data...');
    syncOfflineData();
  });
  
  window.addEventListener('offline', () => {
    toast.error('You are offline. Changes will be saved and synced when you reconnect.');
  });
  
  // Initial sync if online
  if (navigator.onLine) {
    syncOfflineData();
  }
  
  // Register background sync if supported
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.sync.register('sync-appointments');
      registration.sync.register('sync-records');
    });
  }
}