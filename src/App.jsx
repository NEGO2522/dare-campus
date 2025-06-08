// src/App.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [dare, setDare] = useState('');

  useEffect(() => {
    const fetchDare = async () => {
      const querySnapshot = await getDocs(collection(db, 'dares'));
      const dares = querySnapshot.docs.map(doc => doc.data());
      const randomIndex = Math.floor(Math.random() * dares.length);
      setDare(dares[randomIndex]?.text || "No dare found");
    };
    fetchDare();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Your Dare Today 💥</h1>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dare}</p>
    </div>
  );
}

export default App;
