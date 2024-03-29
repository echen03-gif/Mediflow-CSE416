import React, { useState, useEffect } from 'react';
import { functions } from '../firebaseConfig.js';
import { httpsCallable } from 'firebase/functions';

function Inventory() {
    const [tests, setTests] = useState([]);

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
