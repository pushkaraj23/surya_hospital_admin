import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { People, CalendarToday, QuestionAnswer, LocalHospital } from '@mui/icons-material';
import OverviewCard from '../../../components/OverviewCard';

// Assuming you have this component or similar structure from the first answer
// const OverviewCard = ({ title, value, icon: Icon, color }) => (
//   <Card sx={{ minWidth: 275, boxShadow: 3, borderLeft: `5px solid ${color}` }}>
//     <CardContent>
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Box>
//           <Typography color="text.secondary" gutterBottom>{title}</Typography>
//           <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>{value}</Typography>
//         </Box>
//         <Icon sx={{ color: color, fontSize: 40 }} />
//       </Box>
//     </CardContent>
//   </Card>
// );

// --- DUMMY DATA ---
const MOCK_STATS = {
  totalDoctors: 45,
  appointments: 120,
  inquiries: 7,
  departments: 15,
};

const MOCK_FEEDBACK = [
  { id: 1, patientName: 'Alice Johnson', subject: 'Excellent Service', rating: 5 },
  { id: 2, patientName: 'Bob Smith', subject: 'Appointment Issue', rating: 3 },
  { id: 3, patientName: 'Charlie Brown', subject: 'New Department', rating: 4 },
];
// ------------------


const Dashboard = () => {
  // Use a state for loading, even with mock data, to simulate real behavior
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay (e.g., 500ms) before loading dummy data
    const timer = setTimeout(() => {
      setStats(MOCK_STATS);
      setFeedback(MOCK_FEEDBACK);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  const { totalDoctors, appointments, inquiries, departments } = stats;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ backgroundColor: 'var(--secondary-color)', p:2 , borderRadius: '8px', mb:4}}>
        <Typography variant="h5">
            <span role="img" aria-label="dashboard">✨</span> Dashboard Overview
        </Typography>
      </Box>

      {/* --- 1. Overview Cards --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard title="Total Doctors" value={totalDoctors} icon={People} color="#009688" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard title="Appointments" value={appointments} icon={CalendarToday} color="#2196f3" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard title="Inquiries" value={inquiries} icon={QuestionAnswer} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard title="Departments" value={departments} icon={LocalHospital} color="#e91e63" />
        </Grid>
      </Grid>

      {/* --- 2. Graphs and Tables (Placeholders) --- */}
      <Grid container spacing={3}>
        
        {/* Graph Placeholder */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Monthly Appointments Graph Area</Typography>
          </Card>
        </Grid>

        {/* Graph Placeholder */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" color="text.secondary">Monthly Inquiries Graph Area</Typography>
          </Card>
        </Grid>

        {/* Latest Feedback Placeholder (Replace with ReusableTable later) */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Latest Feedback</Typography>
            <ul>
              {feedback.map(f => (
                <li key={f.id}>{f.patientName}: {f.subject} (Rating: {f.rating})</li>
              ))}
            </ul>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;