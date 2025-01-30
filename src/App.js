import './App.css';
import Header from './component/header/Header';
import Contract from './pages/contract/contract';
import Invoice from './pages/invoice/invoice';
import Option from './pages/option/option';
import Home from './pages/home/home';
import Delivery from './pages/delivery/delivery';
import Estimate from './pages/estimate/estimate';
import Order from './pages/order/order';
import Receipt from './pages/receipt/receipt';
import CustomerForm from './component/customerForm/CustomerForm';
import Footer from './component/footer/Footer';

import { Fab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { initializeLocalStorage } from './utils/storage';

function App() {
  const [openCustomerForm, setOpenCustomerForm] = useState(false);

  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/option" element={<Option />} />
          <Route path="/delivery" element={<Delivery />}/>
          <Route path="/order" element={<Order />}/>
          <Route path="/estimate" element={<Estimate />}/>
          <Route path="/Receipt" element={<Receipt />}/>
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
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
