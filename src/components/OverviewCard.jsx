import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const OverviewCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ minWidth: 275, boxShadow: 3, borderLeft: `5px solid ${color}`,borderRadius: 'var(--border-radius-base)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 15px rgba(0,0,0,0.15)',
    }, }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Icon sx={{ color: color, fontSize: 40, opacity: 0.7 }} />
      </Box>
    </CardContent>
  </Card>
);

export default OverviewCard;