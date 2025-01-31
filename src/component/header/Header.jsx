import React, { useState } from 'react';
import './Header.css';
import { 
    AppBar, 
    Toolbar, 
    Button, 
    IconButton, 
    Drawer, 
    List, 
    ListItem, 
    ListItemText,
    useTheme,
    useMediaQuery,
    Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { text: 'ホーム', path: '/' },
        { text: '契約書', path: '/contract' },
        { text: '請求書', path: '/invoice' },
        { text: '見積書', path: '/estimate' },
        { text: '発注書', path: '/order' },
        { text: '納品書', path: '/delivery' },
        { text: '領収書', path: '/receipt' },
        { text: '設定', path: '/option' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <List>
            {menuItems.map((item) => (
                <ListItem 
                    button 
                    component={Link} 
                    to={item.path} 
                    key={item.text}
                    onClick={handleDrawerToggle}
                >
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <div className="header">
            <AppBar position="static">
                <Toolbar>
                    {isMobile ? (
                        <>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                帳票作成アプリ
                            </Box>
                        </>
                    ) : (
                        <>
                            {menuItems.map((item) => (
                                <Button 
                                    color="inherit" 
                                    component={Link} 
                                    to={item.path}
                                    key={item.text}
                                >
                                    {item.text}
                                </Button>
                            ))}
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // モバイルでのパフォーマンス向上のため
                }}
            >
                {drawer}
            </Drawer>
        </div>
    );
};

export default Header;