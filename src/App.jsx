import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./modules/layout/MainLayout";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Doctors from "./modules/doctors/pages/Doctors";

// const MainLayout = ({ children }) => {
//   return (
//     // <div style={{ display: 'flex' }}>
//     //   {/* Placeholder for Sidebar/Navigation */}
//     //   <aside style={{ width: '200px', padding: '20px', borderRight: '1px solid #ccc' }}>
//     //     <h2>CMS Nav</h2>
//     //     {/* Navigation Links go here */}
//     //   </aside>

//     //   {/* Main Content Area */}
//     //   <main style={{ flexGrow: 1, padding: '20px' }}>
//     //     {children}
//     //   </main>
//     // </div>

//     <div style={{ display: 'flex', minHeight: '100vh' }}>

//       {/* Sidebar/Navigation */}
//       {/* <aside style={{
//         width: '200px',
//         padding: '20px',
//         backgroundColor: 'var(--background-dark)',
//         color: 'white',
//         boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
//       }}>
//         <h2>CMS Panel</h2>
//         <nav>
//           <ul style={{ listStyle: 'none', padding: 0 }}>
//             <li ><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a></li>
//             <li ><a href="/doctors" style={{ color: 'white', textDecoration: 'none' }}>Doctors</a></li>
//             <li ><a href="/appointments" style={{ color: 'white', textDecoration: 'none' }}>Appointments</a></li>
//           </ul>
//         </nav>
//       </aside> */}

//       {/* Main Content Area */}
//       <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f4f6f8' }}>
//         {children}
//       </main>
//     </div>

//   );
// };

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </MainLayout>
  );
}

export default App;
