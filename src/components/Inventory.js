import React, { useState, useEffect } from 'react';
import db from '../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore'; 

function Inventory() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use the modular function getDocs and collection reference
                const querySnapshot = await getDocs(collection(db, 'Test'));
                const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTests(data);
            } catch (error) {
                console.error("Error fetching data from Firestore", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Test Collection</h2>
            <ul>
                {tests.map(test => (
                    <li key={test.id}>
                        Test: {test.Test}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Inventory;
