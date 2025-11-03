import { useEffect, useState } from "react";
import {
  People,
  CalendarToday,
  QuestionAnswer,
  LocalHospital,
  Star,
} from "@mui/icons-material";

const MOCK_STATS = {
  totalDoctors: 45,
  appointments: 120,
  inquiries: 7,
  departments: 15,
};

const MOCK_FEEDBACK = [
  { id: 1, patientName: "Alice Johnson", subject: "Excellent Service", rating: 5 },
  { id: 2, patientName: "Bob Smith", subject: "Appointment Issue", rating: 3 },
  { id: 3, patientName: "Charlie Brown", subject: "Quick Response", rating: 4 },
];

const Dashboard = () => {
  const [stats] = useState(MOCK_STATS);
  const [feedback] = useState(MOCK_FEEDBACK);

  const { totalDoctors, appointments, inquiries, departments } = stats;

  return (
    <div className="p-6 space-y-8 font-primary">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-5 rounded-lg shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          ✨ Dashboard Overview
        </h2>
        <span className="text-sm opacity-90 font-secondary">
          Surya Hospital CMS
        </span>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Doctors"
          value={totalDoctors}
          icon={<People />}
          color="bg-primary"
        />
        <OverviewCard
          title="Appointments"
          value={appointments}
          icon={<CalendarToday />}
          color="bg-accent"
        />
        <OverviewCard
          title="Inquiries"
          value={inquiries}
          icon={<QuestionAnswer />}
          color="bg-secondary"
        />
        <OverviewCard
          title="Departments"
          value={departments}
          icon={<LocalHospital />}
          color="bg-primary-dark"
        />
      </div>

      {/* Graphs and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph Placeholder 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-center items-center min-h-[320px] border border-gray-100">
          <h3 className="text-gray-700 font-medium font-secondary">
            Monthly Appointments Graph
          </h3>
          <p className="text-gray-400 text-sm mt-2">(Chart placeholder)</p>
        </div>

        {/* Graph Placeholder 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-center items-center min-h-[320px] border border-gray-100">
          <h3 className="text-gray-700 font-medium font-secondary">
            Monthly Inquiries Graph
          </h3>
          <p className="text-gray-400 text-sm mt-2">(Chart placeholder)</p>
        </div>
      </div>

      {/* Latest Feedback */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-primary mb-5">
          Latest Patient Feedback
        </h3>
        <ul className="divide-y divide-gray-200">
          {feedback.map((f) => (
            <li
              key={f.id}
              className="py-4 flex justify-between items-center hover:bg-gray-50 transition-all duration-200 rounded-lg px-2"
            >
              <div>
                <p className="font-semibold text-gray-800">{f.patientName}</p>
                <p className="text-sm text-gray-500">{f.subject}</p>
              </div>
              <div className="flex text-accent">
                {[...Array(f.rating)].map((_, i) => (
                  <Star key={i} fontSize="small" />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- Reusable Overview Card Component ---
const OverviewCard = ({ title, value, icon, color }) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-md text-white flex items-center justify-between hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ${color}`}
    >
      <div>
        <h4 className="text-sm font-secondary font-medium opacity-90 uppercase tracking-wide">
          {title}
        </h4>
        <p className="text-3xl font-semibold mt-1">{value}</p>
      </div>
      <div className="opacity-90">{icon}</div>
    </div>
  );
};

export default Dashboard;
