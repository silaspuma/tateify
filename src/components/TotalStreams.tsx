'use client';

import React, { useState, useEffect } from 'react';
import { getFirebaseDatabase } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

interface TotalStreamsProps {
  isDarkTheme?: boolean;
}

const TotalStreams: React.FC<TotalStreamsProps> = ({ isDarkTheme = false }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fallback = () => {
      fetch('/api/streams')
        .then((r) => r.json())
        .then((data) => { if (isMounted) setCount(data.count ?? 0); })
        .catch(() => { if (isMounted) setCount(null); });
    };

    try {
      const database = getFirebaseDatabase();
      const streamsRef = ref(database, 'totalStreams');
      const unsubscribe = onValue(
        streamsRef,
        (snapshot) => {
          if (isMounted) setCount(snapshot.exists() ? snapshot.val() : 0);
        },
        () => fallback()
      );
      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch {
      fallback();
      return () => { isMounted = false; };
    }
  }, []);

  return (
    <div
      className={`px-6 py-5 border-t ${
        isDarkTheme ? 'border-white/10' : 'border-black/10'
      }`}
    >
      <p
        className={`text-xs font-bold uppercase tracking-widest mb-1 ${
          isDarkTheme ? 'text-white/50' : 'text-text/50'
        }`}
      >
        Total Streams
      </p>
      <p
        className={`text-3xl font-black tabular-nums ${
          isDarkTheme ? 'text-white' : 'text-text'
        }`}
      >
        {count === null ? '—' : count.toLocaleString()}
      </p>
    </div>
  );
};

export default TotalStreams;
