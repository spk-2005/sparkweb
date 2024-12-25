import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './header';
import Home from './home';
import About from './about';
import Imagestopdf from './Converters/imagestopdf';
import Texttopdf from './Converters/texttopdf';
import Pdftotext from './Converters/pdftotext';
import Imagetotext from './Converters/imagetotext';
import Csvtojson from './Converters/csvtojson';
import Jsontocsv from './Converters/jsontocsv';
import Findcgpa from './Engineering/findcgpa';
import Findsgpa from './Engineering/findsgpa';
import Typingtest from './Engineering/typingtest';
import Typing from './Engineering/typing';
import Typingtime from './Engineering/typingtime';
import Typingresult from './Engineering/typingresult';
import Typingranks from './Engineering/typingranks';
import News from './news';
import Newsportal from './newsportal';

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
      <Route path='news/:id/:collection' element={<News/>}/>
      <Route path='newsportal' element={<Newsportal/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
