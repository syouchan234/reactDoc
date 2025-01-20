import './App.css';
import Header from './component/header/Header';
import Contract from './pages/contract/contract';
import Invoice from './pages/invoice/invoice';
import Option from './pages/option/option';
import Home from './pages/home/home';

import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/option" element={<Option />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
