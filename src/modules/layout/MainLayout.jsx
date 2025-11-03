import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container flex min-h-screen">
      <Sidebar /> 
      <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f4f6f8' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;