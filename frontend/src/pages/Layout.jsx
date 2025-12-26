import React from 'react';
import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
          {children}
      </main>
    </React.Fragment>
  );
};

export default Layout;