import { useEffect, useRef, useState } from 'react';

const DEFAULT_STATE = {
  students: [],
  faculty: [],
  transactions: [],
  placements: [],
  alumni: [],
  attendance: [],
  attendanceAudit: []
};

export function useERPDatabase() {
  const [db, setDb] = useState(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const remoteUpdateRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function loadData(isPolling = false) {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const data = await res.json();
          if (active) {
            remoteUpdateRef.current = isPolling;
            setDb({ ...DEFAULT_STATE, ...data });
          }
        } else {
          console.error('Failed to load database from backend');
        }
      } catch (err) {
        console.error('Error fetching database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const refreshId = setInterval(() => loadData(true), 10000);
    return () => {
      active = false;
      clearInterval(refreshId);
    };
  }, []);

  // Sync state changes to MongoDB
  useEffect(() => {
    // Skip syncing if we are still loading the initial database state
    if (loading) return;
    if (remoteUpdateRef.current) {
      remoteUpdateRef.current = false;
      return;
    }

    const controller = new AbortController();
    async function syncData() {
      try {
        await fetch('/api/db/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(db),
          signal: controller.signal
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error syncing database to backend:', err);
        }
      }
    }

    // Debounce syncing slightly to avoid rapid backend requests during multi-step changes
    const timeoutId = setTimeout(syncData, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [db, loading]);

  return [db, setDb];
}
