import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { People, CalendarToday, QuestionAnswer, Dashboard as DashboardIcon } from '@mui/icons-material';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon },
    { path: '/doctors', label: 'Doctors', icon: People },
    { path: '/appointments', label: 'Appointments', icon: CalendarToday },
    { path: '/inquiries', label: 'Inquiries', icon: QuestionAnswer },
  ];

  return (
    // <aside style={{ 
    //   width: '250px', 
    //   padding: '20px 0',
    //   backgroundColor: 'var(--sidebar-bg)', 
    //   color: 'var(--text-light)',
    //   boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
    //   flexShrink: 0,
    // }}>
    //   <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
    //     <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
    //       CMS Portal
    //     </Typography>
    //   </Box>
    //   <nav>
    //     <ul style={{ listStyle: 'none', padding: 0 }}>
    //       {navItems.map((item) => (
    //         <li key={item.path}>
    //           <Link 
    //             to={item.path} 
    //             style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', transition: 'background-color 0.2s' }}
    //             className="sidebar-link"
    //           >
    //             <item.icon sx={{ mr: 2, fontSize: 20 }} />
    //             {item.label}
    //           </Link>
    //         </li>
    //       ))}
    //     </ul>
    //   </nav>
    // </aside>
    <aside style={{ 
        width: '200px', 
        padding: '20px', 
        backgroundColor: 'var(--background-dark)',
        color: 'white',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        {/* <h2>CMS Panel</h2> */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          CMS Portal
        </Typography>
      </Box>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {/* <li ><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a></li>
            <li ><a href="/doctors" style={{ color: 'white', textDecoration: 'none' }}>Doctors</a></li>
            <li ><a href="/appointments" style={{ color: 'white', textDecoration: 'none' }}>Appointments</a></li> */}
            {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                style={{ display: 'flex', alignItems: 'center',color: 'white', padding: '8px 20px', transition: 'background-color 0.2s' }}
                className="sidebar-link"
              >
                <item.icon sx={{ mr: 2, fontSize: 20 }} />
                {item.label}
              </Link>
            </li>
          ))}
          </ul>
        </nav>
      </aside>
  );
};

export default Sidebar;