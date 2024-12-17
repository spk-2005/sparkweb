import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './header';
import Home from './home';
import About from './about';
import Imagestopdf from './imagestopdf';
import Texttopdf from './texttopdf';

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
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
