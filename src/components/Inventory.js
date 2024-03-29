import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@mui/material';
import { functions } from '../firebaseConfig.js';
import { httpsCallable } from 'firebase/functions';

function Inventory() {
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    const handleAddItem = () => {
        navigate('/main/additem');
    };

    useEffect(() => {
        /*const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Test'));
                const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTests(data);
            } catch (error) {
                console.error("Error fetching data from Firestore", error);
            }
        };*/
        async function fetchTestData() {
            const retrieveTestData = httpsCallable(functions, 'retrieveTestData');

            try {
                const result = await retrieveTestData();
                console.log(result.data);
                setTests(result.data);
            } catch (error) {
                console.error("Error fetching test data:", error);
            }
        }

        fetchTestData();
    }, []);

    return (
        <div>
            <Button variant="contained" onClick={handleAddItem}>
                Add Item
            </Button>
            <h2>Test Collection</h2>
            <ul>
                {tests.map((test, index) => (
                    <li key={index}>
                        Test: {test.Test}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Inventory;
