import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './typingtime.css'; // CSS for styling

export default function Typingtime() {
    const { level,name} = useParams();
    const navigate = useNavigate();
    localStorage.setItem('name',name);
    const handleTest = (time) => {
        navigate(`/typing/${level}/${time}`);
    };

    return (
        <>
            <section className="typingtime-section">
                <div className="typingtime-container">
                    <h1>Select Typing Test Duration</h1>
                    <ol className="typingtime-list">
                        <li onClick={() => handleTest('30seconds')}>30 Seconds</li>
                        <li onClick={() => handleTest('1minute')}>1 Minute</li>
                        <li onClick={() => handleTest('5minutes')}>5 Minutes</li>
                        <li onClick={() => handleTest('10minutes')}>10 Minutes</li>
                        <li onClick={() => handleTest('30minutes')}>30 Minutes</li>
                    </ol>
                </div>
            </section>
        </>
    );
}
