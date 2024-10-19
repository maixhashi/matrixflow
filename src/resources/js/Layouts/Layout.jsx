import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../../css/Layout.css'

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
