import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

export const useNavigationHandler = () => {
  const navigate = useNavigate();

  const goToDashboard = () => navigate(ROUTES.DASHBOARD);
  const goToAppointments = () => navigate(ROUTES.APPOINTMENTS);
  // Add more navigation helpers as needed

  return {
    goToDashboard,
    goToAppointments,
    // ...
  };
};