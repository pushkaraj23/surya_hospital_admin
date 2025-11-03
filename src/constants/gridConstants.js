export const DOCTOR_COLUMNS = [
    { header: 'ID', key: 'id', width: '5%' },
    { header: 'Name', key: 'name', width: '25%' },
    { header: 'Specialty', key: 'specialty', width: '25%' },
    { header: 'Contact', key: 'phone', width: '20%' },
    { header: 'Status', key: 'status', width: '10%' },
    { 
        header: 'Actions', 
        key: 'actions', 
        width: '15%', 
        actions: {
            // Set true for actions you want to enable for this grid
            canView: false,
            canEdit: true,
            canDelete: true, // Only Delete is enabled for the Doctors list
        }
    },
];
