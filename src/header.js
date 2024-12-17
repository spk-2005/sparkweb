import React from 'react'
import './header.css';
export default function Header() {
    function CustomLink({ href, children, onClick }) {
        const path = window.location.pathname;
        return (
            <li className={path === href ? "active" : ""} onClick={onClick}>
                <a href={href}>{children}</a>
            </li>
        );
    }
  return (
    <>
    <section id='header-section'>
        <div id='header-cont'>
            <ol>
                <CustomLink href='/'>Home</CustomLink>
                <CustomLink href='./about'>About</CustomLink>
                <li>Coverters
                    <ul>
                        <CustomLink href='./imagestopdf'>Images To PDF</CustomLink>
                        <CustomLink href='./texttopdf'>Text To PDF</CustomLink>
                        <CustomLink href='./pdftotext'>PDF to Text</CustomLink>
                        <CustomLink href='./imagetotext'>Image To Text</CustomLink>
                        <CustomLink href='./csvtojson'>CSV to JSON</CustomLink>
                        <CustomLink href='./jsontocsv'>JSON to CSV</CustomLink>
                        </ul>
                </li>
                <li>Engineering
                    <ul>
                        <CustomLink href='./cgpa'>Find CGPA</CustomLink>
                        <CustomLink href='./sgpa'>Find SGPA</CustomLink>
                        <CustomLink href='./resume'>Resume Builder</CustomLink>
                        </ul>
                </li>
                <li>Wishes
                    <ul>
                        <CustomLink href='./birth'>Birthday Wishes</CustomLink>
                        <CustomLink href='./festival'>Festival Wishes</CustomLink>
                        <CustomLink href='./marriage'>Marriage Wishes</CustomLink>
                        <CustomLink href='./independence'>Independence Day Wishes</CustomLink>
                        <CustomLink href='./republic'>Republic Day Wishes</CustomLink>
                        </ul>
                </li>
                <li>Mock Tests
                    <ul>
                        <CustomLink href='./gate'>GATE(Previous Papers)</CustomLink>
                        <CustomLink href='./jeemains'>JEE Mains(Previous Papers)</CustomLink>
                        <CustomLink>10 Th Class</CustomLink>
                        </ul>
                </li>
            </ol>
        </div>
    </section> 
    </>
  )
}
