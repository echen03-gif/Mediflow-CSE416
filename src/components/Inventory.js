import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
