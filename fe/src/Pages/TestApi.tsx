import { useEffect, useState } from 'react';

function TestApi() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('https://5cb83tf0-5000.asse.devtunnels.ms/api/message')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(err => console.error('Error fetching message:', err));
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>React + Express Demo</h1>
            <p>Message from backend: {message}</p>
        </div>
    );
}

export default TestApi;
