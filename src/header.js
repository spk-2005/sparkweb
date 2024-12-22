import React from 'react';
import './header.css';
import logo from './SPK_HUB.png';

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
                        <div>
                            <a href='/'><img src={logo} alt='SPK-HUB' /></a>
                        </div>
                        <CustomLink href='/'>Home</CustomLink>
                        <CustomLink href='./about'>About</CustomLink>
                        <li>Converters
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
                                <CustomLink href='./findcgpa'>Find CGPA</CustomLink>
                                <CustomLink href='./findsgpa'>Find SGPA</CustomLink>
                                <CustomLink href='./resume'>Resume Builder</CustomLink>
                                <CustomLink href='./typingtest'>Typing Test</CustomLink>
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
                                <CustomLink href='./gate'>GATE (Previous Papers)</CustomLink>
                                <CustomLink href='./jeemains'>JEE Mains (Previous Papers)</CustomLink>
                                <CustomLink>10th Class</CustomLink>
                            </ul>
                        </li>
                    </ol>
                </div>
                
            </section>
        </>
    );
}
