import { API_CONSTANTS } from '../../../constants/apiConstants'

// --- MOCK DATA SIMULATION ---
const MOCK_DOCTORS_DATA = [
    { id: 101, name: 'Dr. Jane Smith', specialty: 'Cardiology', phone: '555-1234', status: 'Active' },
    { id: 102, name: 'Dr. John Doe', specialty: 'Pediatrics', phone: '555-5678', status: 'Active' },
    { id: 103, name: 'Dr. Emily Chen', specialty: 'Neurology', phone: '555-9012', status: 'On Leave' },
    { id: 104, name: 'Dr. Alex Brown', specialty: 'Dermatology', phone: '555-3456', status: 'Active' },
];
// ----------------------------

class DoctorService {
    // Reusable fetch wrapper for standardizing API calls
    async fetchDoctors() {
        const endpoint = API_CONSTANTS.ProductsConstants.API_END_POINTS.Doctors.getDoctors;

        console.log(`Simulating API call to: ${endpoint} (Method: GET)`);

        try {
            // Simulate a network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // In a real app, you would use:
            // const response = await fetch(endpoint.url, { method: endpoint.method });
            // if (!response.ok) throw new Error('Network response was not ok');
            // return await response.json();

            // Return mock data for demonstration
            return MOCK_DOCTORS_DATA;

        } catch (error) {
            console.error("Error fetching doctors:", error);
            // In a real app, you'd handle logging and throwing a user-friendly error
            throw new Error("Failed to load doctor data.");
        }
    }
    
    // async addDoctor(data) { ... }
}

export default new DoctorService();
