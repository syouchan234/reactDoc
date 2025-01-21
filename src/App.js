import './App.css';
import Header from './component/header/Header';
import Contract from './pages/contract/contract';
import Invoice from './pages/invoice/invoice';
import Option from './pages/option/option';
import Home from './pages/home/home';
import CustomerForm from './component/customerForm/CustomerForm';
import { Fab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function App() {
  const [openCustomerForm, setOpenCustomerForm] = useState(false);

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
        
        <Fab 
          color="primary" 
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem'
          }}
          onClick={() => setOpenCustomerForm(true)}
        >
          <PersonAddIcon />
        </Fab>

        <CustomerForm 
          open={openCustomerForm} 
          onClose={() => setOpenCustomerForm(false)} 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
