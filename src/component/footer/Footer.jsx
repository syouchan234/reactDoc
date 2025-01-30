import React from 'react';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem' }}>
            <p>&copy; {new Date().getFullYear()} <a href="http://tanakatech.starfree.jp" target="_blank" rel="noreferrer">TanakaTeck</a>. All rights reserved.</p>
        </footer>
    );
};

export default Footer; 