import React from 'react';
import './contract.css';
import { Button } from '@mui/material';


const Contract = () => {
    return (
        <div className="contract">
            <h1>契約書</h1>
            <Button variant="contained" color="primary">.xlsxでダウンロード</Button>
            <Button variant="contained" color="primary">.pdfでダウンロード</Button>
        </div>
    );
};

export default Contract;