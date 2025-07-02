import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

const VISITOR_THROTTLE_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds
const STORAGE_KEY = 'visitor_last_counted';

function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeVisitorCounter = async () => {
      try {
        // Get current visitor count
        const visitorDocRef = doc(db, 'visitors', 'counts');
        const visitorDoc = await getDoc(visitorDocRef);
        
        let currentCount = 0;
        
        if (visitorDoc.exists()) {
          currentCount = visitorDoc.data().total || 0;
        } else {
          // Initialize the document if it doesn't exist
          await setDoc(visitorDocRef, {
            total: 1,
            lastUpdated: serverTimestamp()
          });
          currentCount = 1;
        }

        setVisitorCount(currentCount);

        // Check if we should increment the counter
        const lastCounted = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        
        if (!lastCounted || (now - parseInt(lastCounted)) > VISITOR_THROTTLE_TIME) {
          // Increment the counter
          if (visitorDoc.exists()) {
            await updateDoc(visitorDocRef, {
              total: increment(1),
              lastUpdated: serverTimestamp()
            });
            setVisitorCount(currentCount + 1);
          }
          
          // Update localStorage with current timestamp
          localStorage.setItem(STORAGE_KEY, now.toString());
        }

        setLoading(false);
      } catch (error) {
        console.error('Error handling visitor counter:', error);
        // Fallback to a static number if Firebase fails
        setVisitorCount(1000);
        setLoading(false);
      }
    };

    initializeVisitorCounter();
  }, []);

  if (loading) {
    return (
      <div className="visitor-counter">
        <h1>Loading visitors...</h1>
      </div>
    );
  }

  return (
    <div className="visitor-counter">
      <h1>{visitorCount.toLocaleString()} Website Visitors</h1>
    </div>
  );
}

export default VisitorCounter;