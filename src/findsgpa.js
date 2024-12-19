import React, { useState } from 'react';
import './findsgpa.css';

export default function Findsgpa() {
  
  const [grades, setGrades] = useState({
    subject1: { grade: '', credits: 3 },
    subject2: { grade: '', credits: 3 },
    subject3: { grade: '', credits: 3 },
    subject4: { grade: '', credits: 3},
    subject5: { grade: '', credits: 3 },
    subject6: { grade: '', credits: 3 },
    lab1: { grade: '', credits: 1.5 },
    lab2: { grade: '', credits: 1.5 },
    lab3: { grade: '', credits: 1.5 },
    lab4: { grade: '', credits: 1.5 },
    skillOriented: { grade: '', credits: 2 },
  });

  
  const gradePoints = {
    'A+': 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    E: 5,
    F: 0,
  };

  
  const calculateSGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    
    Object.keys(grades).forEach((subject) => {
      const grade = grades[subject].grade;
      const credits = grades[subject].credits;
      if (grade && credits > 0) {
        totalGradePoints += gradePoints[grade] * credits;
        totalCredits += credits;
      }
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
  };

  
  const handleChange = (e, subject, type) => {
    const value = type === 'grade' ? e.target.value : parseFloat(e.target.value);
    setGrades((prevGrades) => ({
      ...prevGrades,
      [subject]: {
        ...prevGrades[subject],
        [type]: value,
      },
    }));
  };

  return (
    <>
      <section id='findsgpa-section'>  
        <h1>Find Your SGPA</h1>
        <div>
            <h3>Your SGPA: {calculateSGPA()}</h3>
          </div>
        <div id='findsgpa-cont'>
          <table>
            <tbody>
              {Object.keys(grades).map((subject, index) => {
                const isGrade = index % 2 === 0;
                return (
                  
                  <tr key={subject}>
    <h1 style={{display:'none'}}>{isGrade}</h1>
                    <td>Enter {subject.replace(/([A-Z])/g, ' $1').trim()} Grade</td>
                    <td>:</td>
                    <td>
                      <select
                        value={grades[subject].grade}
                        onChange={(e) => handleChange(e, subject, 'grade')}
                      >
                        <option value="">Select Grade</option>
                        <option>A+</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                        <option>E</option>
                        <option>F</option>
                      </select>
                    </td>
                    <td>Enter {subject.replace(/([A-Z])/g, ' $1').trim()} Credits</td>
                    <td>:</td>
                    <td>
                      <input
                        type="number"
                        value={grades[subject].credits}
                        onChange={(e) => handleChange(e, subject, 'credits')}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        <button>Calculate SGPA</button>
        </div>
      </section>
    </>
  );
}
