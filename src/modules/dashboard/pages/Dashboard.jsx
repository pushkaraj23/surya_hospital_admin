// import { useEffect, useState } from "react";
// import {
//   People,
//   CalendarToday,
//   QuestionAnswer,
//   LocalHospital,
//   Star,
// } from "@mui/icons-material";

// const MOCK_STATS = {
//   totalDoctors: 45,
//   appointments: 120,
//   inquiries: 7,
//   departments: 15,
// };

// const MOCK_FEEDBACK = [
//   { id: 1, patientName: "Alice Johnson", subject: "Excellent Service", rating: 5 },
//   { id: 2, patientName: "Bob Smith", subject: "Appointment Issue", rating: 3 },
//   { id: 3, patientName: "Charlie Brown", subject: "Quick Response", rating: 4 },
// ];

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [feedback, setFeedback] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate 500ms API loading delay
//     const timer = setTimeout(() => {
//       setStats(MOCK_STATS);
//       setFeedback(MOCK_FEEDBACK);
//       setLoading(false);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[80vh] text-white font-primary">
//         <div className="bg-white/20 backdrop-blur-md rounded-full h-16 w-16 border-4 border-t-transparent border-white animate-spin mb-4"></div>
//         <p className="text-lg font-secondary opacity-90 animate-pulse">
//           Loading Dashboard...
//         </p>
//       </div>
//     );
//   }

//   const { totalDoctors, appointments, inquiries, departments } = stats;

//   return (
//     <div className="font-primary min-h-screen text-white relative overflow-hidden scrollbarHide animate-fadeIn">
//       <div className="relative z-10 space-y-8">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-primary via-secondary to-accent px-6 py-5 rounded-xl shadow-xl backdrop-blur-md bg-opacity-80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <h2 className="text-2xl font-semibold flex items-center gap-2 drop-shadow-sm">
//             ✨ Dashboard Overview
//           </h2>
//           <span className="text-sm opacity-90 font-secondary">
//             Surya Hospital CMS
//           </span>
//         </div>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <OverviewCard
//             title="Total Doctors"
//             value={totalDoctors}
//             icon={<People />}
//             gradient="from-primary/90 to-primary-dark"
//           />
//           <OverviewCard
//             title="Appointments"
//             value={appointments}
//             icon={<CalendarToday />}
//             gradient="from-secondary to-accent"
//           />
//           <OverviewCard
//             title="Inquiries"
//             value={inquiries}
//             icon={<QuestionAnswer />}
//             gradient="from-accent to-yellow-400"
//           />
//           <OverviewCard
//             title="Departments"
//             value={departments}
//             icon={<LocalHospital />}
//             gradient="from-primary-dark to-secondary"
//           />
//         </div>

//         {/* Graphs Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <GlassCard title="Monthly Appointments Graph" />
//           <GlassCard title="Monthly Inquiries Graph" />
//         </div>

//         {/* Feedback Section */}
//         <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/30 text-white">
//           <h3 className="text-lg font-semibold mb-5 text-accent drop-shadow-sm">
//             Latest Patient Feedback
//           </h3>
//           <ul className="divide-y divide-white/20">
//             {feedback.map((f) => (
//               <li
//                 key={f.id}
//                 className="py-4 flex justify-between items-center hover:bg-white/10 transition-all duration-300 rounded-lg px-2"
//               >
//                 <div>
//                   <p className="font-semibold">{f.patientName}</p>
//                   <p className="text-sm text-white/70">{f.subject}</p>
//                 </div>
//                 <div className="flex text-accent">
//                   {[...Array(f.rating)].map((_, i) => (
//                     <Star key={i} fontSize="small" />
//                   ))}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Overview Card with Gradient + Glass ---
// const OverviewCard = ({ title, value, icon, gradient }) => {
//   return (
//     <div
//       className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-2xl shadow-lg flex items-center justify-between transition-all duration-300 transform hover:scale-[1.04] hover:shadow-2xl backdrop-blur-md bg-opacity-80 border border-white/20`}
//     >
//       <div>
//         <h4 className="text-sm font-secondary opacity-90 uppercase tracking-wide">
//           {title}
//         </h4>
//         <p className="text-3xl font-semibold mt-1">{value}</p>
//       </div>
//       <div className="opacity-90 drop-shadow-sm">{icon}</div>
//     </div>
//   );
// };

// // --- Glass Effect Placeholder Card ---
// const GlassCard = ({ title }) => (
//   <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-lg flex flex-col justify-center items-center min-h-[320px] text-center">
//     <h3 className="text-white font-semibold font-secondary drop-shadow-sm">
//       {title}
//     </h3>
//     <p className="text-white/70 text-sm mt-2">(Chart placeholder)</p>
//   </div>
// );

// export default Dashboard;
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
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(MOCK_STATS);
      setFeedback(MOCK_FEEDBACK);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-700 font-primary">
        <div className="border-4 border-t-transparent border-blue-400 rounded-full h-12 w-12 animate-spin mb-4"></div>
        <p className="text-lg font-medium animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  const { totalDoctors, appointments, inquiries, departments } = stats;

  return (
    <div className="font-primary min-h-screen bg-gray-50 text-gray-800 py-2 space-y-8">
      {/* Header */}
      <div className=" bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-[#c8c9f8] via-[#ced5fb] to-[#e0e7ff] p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between border ">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          ✨ Dashboard Overview
        </h2>
        <span className="text-sm text-gray-600">Surya Hospital CMS</span>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Doctors"
          value={totalDoctors}
          icon={<People className="text-blue-500" />}
          gradient="from-blue-100 to-blue-50"
        />
        <OverviewCard
          title="Appointments"
          value={appointments}
          icon={<CalendarToday className="text-green-500" />}
          gradient="from-green-100 to-green-50"
        />
        <OverviewCard
          title="Inquiries"
          value={inquiries}
          icon={<QuestionAnswer className="text-yellow-500" />}
          gradient="from-yellow-100 to-yellow-50"
        />
        <OverviewCard
          title="Departments"
          value={departments}
          icon={<LocalHospital className="text-purple-500" />}
          gradient="from-purple-100 to-purple-50"
        />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard title="Monthly Appointments Graph" />
        <GlassCard title="Monthly Inquiries Graph" />
      </div>

      {/* Feedback Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-5 text-blue-600">
          Latest Patient Feedback
        </h3>
        <ul className="divide-y divide-gray-200">
          {feedback.map((f) => (
            <li
              key={f.id}
              className="py-4 flex justify-between items-center hover:bg-gray-50 transition-all duration-300 rounded-lg px-2"
            >
              <div>
                <p className="font-semibold">{f.patientName}</p>
                <p className="text-sm text-gray-600">{f.subject}</p>
              </div>
              <div className="flex text-yellow-500">
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

// --- Overview Card ---
const OverviewCard = ({ title, value, icon, gradient }) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all duration-300`}
    >
      <div>
        <h4 className="text-sm text-gray-500 uppercase tracking-wide">
          {title}
        </h4>
        <p className="text-3xl font-semibold mt-1">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
};

// --- Placeholder Graph Card ---
const GlassCard = ({ title }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center min-h-[300px] text-center hover:shadow-md transition-all duration-300">
    <h3 className="text-gray-800 font-semibold">{title}</h3>
    <p className="text-gray-500 text-sm mt-2">(Chart placeholder)</p>
  </div>
);

export default Dashboard;
