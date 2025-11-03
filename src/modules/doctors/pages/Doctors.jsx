import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Grid } from '@mui/material';
import DoctorService from '../services/DoctorService'; // Import the service
import { DOCTOR_COLUMNS } from '../../../constants/gridConstants'; // Import columns
import ReusableTable from '../../../components/ReusableTable'; 

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setIsLoading(true);
                const data = await DoctorService.fetchDoctors();
                setDoctors(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadDoctors();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2, color: 'var(--primary-color)' }}>
                    Fetching Doctor Data...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" color="error">Error Loading Doctors</Typography>
                <Typography color="textSecondary">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>

            <Box sx={{ backgroundColor: 'var(--secondary-color)', p:2 , borderRadius: '8px', mb:4}}>
                <Typography variant="h5">
                    Doctors Management
                </Typography>
            </Box>
            <Card sx={{ p: 2, borderRadius: 'var(--border-radius-base)', boxShadow: 3 }}>
                <CardContent>
                    {/* 💡 REUSABLE COMPONENT USED HERE */}
                    <ReusableTable 
                        data={doctors} 
                        columns={DOCTOR_COLUMNS} 
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

export default Doctors;