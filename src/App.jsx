import { Routes, Route } from "react-router-dom";
import MainLayout from "./modules/layout/MainLayout";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import Doctors from "./modules/doctors/pages/Doctors";

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
