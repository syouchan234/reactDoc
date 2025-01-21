import React from 'react';
import './Header.css';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="header">
            <div className="toolbar">
                <AppBar position="static" >
                    <Toolbar>
                        <Button color="inherit" component={Link} to="/">ホーム</Button>
                        <Button color="inherit" component={Link} to="/contract">契約書</Button>
                        <Button color="inherit" component={Link} to="/invoice">請求書</Button>
                        <Button color="inherit" component={Link} to="/estimate">見積書</Button>
                        <Button color="inherit" component={Link} to="/order">発注書</Button>
                        <Button color="inherit" component={Link} to="/delivery">納品書</Button>
                        <Button color="inherit" component={Link} to="/receipt">領収書</Button>
                        <Button color="inherit" component={Link} to="/option">設定</Button>
                    </Toolbar>
                </AppBar>
            </div>
        </div>
    );
};

export default Header;