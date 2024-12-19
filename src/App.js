import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './header';
import Home from './home';
import About from './about';
import Imagestopdf from './imagestopdf';
import Texttopdf from './texttopdf';
import Pdftotext from './pdftotext';
import Imagetotext from './imagetotext';
import Csvtojson from './csvtojson';
import Jsontocsv from './jsontocsv';
import Findcgpa from './findcgpa';
import Findsgpa from './findsgpa';
import Typingtest from './typingtest';
import Typing from './typing';
import Typingtime from './typingtime';
import Typingresult from './typingresult';
import Typingranks from './typingranks';

function App() {
  return (
    <>
    <Header/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/imagestopdf' element={<Imagestopdf/>}/>
      <Route path='/texttopdf' element={<Texttopdf/>}/>
      <Route path='/pdftotext' element={<Pdftotext/>}/>
      <Route path='/imagetotext' element={<Imagetotext/>}/>
      <Route path='/csvtojson' element={<Csvtojson/>}/>
      <Route path='/jsontocsv' element={<Jsontocsv/>}/>
      <Route path='/findcgpa' element={<Findcgpa/>}/>
      <Route path='/findsgpa' element={<Findsgpa/>}/>
      <Route path='/typingtest' element={<Typingtest/>}/>
      <Route path='typing/:level/:time' element={<Typing/>}/>
      <Route path='typingtime/:level/:name' element={<Typingtime/>}/>
      <Route path='typingresult' element={<Typingresult/>}/>
      <Route path='typingranks' element={<Typingranks/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
