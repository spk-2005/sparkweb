import React, { useState } from 'react';
import './findcgpa.css';

export default function Findcgpa() {
    const [nosem, setnosem] = useState(0);
    const [sgpa, setsgpa] = useState([]);
    const [final, setfinal] = useState('');

    const handlenosem = (e) => {
        const value = e.target.value;
        if (value === '' || isNaN(value) || value <= 0) {
            setnosem(0);
            setsgpa([]);
        } else {
            setnosem(value);
            setsgpa(new Array(parseInt(value)).fill(''));
        }
    };

    const handlesgpa = (index, value) => {
        if (value === '' || isNaN(value) || value < 0) {
            return;
        }
        const newsgpa = [...sgpa];
        newsgpa[index] = value;
        setsgpa(newsgpa);
    };

    const calculatecgpa = () => {
        const totalsgpa = sgpa.reduce((acc, curr) => acc + parseFloat(curr || 0), 0);
        let cgpa = totalsgpa / sgpa.length;
        setfinal(cgpa);
    };

    return (
        <>
            <section id='cgpa-section'>
                <h1>Find Your CGPA</h1>
                <div>
                    {final !== '' ? (
                        <h3>Your CGPA is {final.toFixed(2)}</h3>
                    ) : null}
                    <div id='cgpa-cont'>
                        <table>
                            <thead>
                                <tr>
                                    <td>Enter Number of Semesters</td>
                                    <td>:</td>
                                    <td>
                                        <input
                                            type='number'
                                            name='noofsem'
                                            value={nosem}
                                            onChange={handlenosem}
                                        />
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: nosem }).map((_, index) => (
                                    <tr key={index}>
                                        <td>Enter Semester {index + 1} SGPA</td>
                                        <td>:</td>
                                        <td>
                                            <input
                                                type='number'
                                                value={sgpa[index]}
                                                onChange={(e) => handlesgpa(index, e.target.value)}
                                                
                                                step='0.01'
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={calculatecgpa} id='calcbut'>Calculate CGPA</button>
                </div>
            </section>
        </>
    );
}
