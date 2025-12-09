import { useState, useEffect } from "react";
import {
  getMonthlyAppointments,
  getMonthlyInquiries,
  getDashboardCounts
} from "../../../api/userApi";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Building2,
  Newspaper,
  Activity,
  Phone,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  CalendarDays
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const Dashboard = () => {
  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [appointmentsData, setAppointmentsData] = useState(null);
  const [inquiriesData, setInquiriesData] = useState(null);
  const [countsData, setCountsData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Available years for selection
  const availableYears = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Fetch Dashboard Data
  const fetchDashboardData = async (selectedYear) => {
    try {
      setLoading(true);
      setError(null);

      const [appointments, inquiries, counts] = await Promise.all([
        getMonthlyAppointments(selectedYear),
        getMonthlyInquiries(selectedYear),
        getDashboardCounts(selectedYear)
      ]);

      setAppointmentsData(appointments);
      setInquiriesData(inquiries);
      setCountsData(counts);

      console.log("Dashboard Data Loaded:", { appointments, inquiries, counts });
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchDashboardData(year);
  }, [year]);

  // Handle Refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(year);
  };

  // Calculate Statistics
  const calculateStats = () => {
    if (!appointmentsData || !inquiriesData) return {};

    const totalAppointments = appointmentsData.totals.reduce((a, b) => a + b, 0);
    const totalInquiries = inquiriesData.totals.reduce((a, b) => a + b, 0);
    
    // Get current month index (0-11)
    const currentMonthIndex = new Date().getMonth();
    const currentMonthAppointments = appointmentsData.totals[currentMonthIndex] || 0;
    const lastMonthAppointments = appointmentsData.totals[currentMonthIndex - 1] || 0;
    
    const appointmentGrowth = lastMonthAppointments > 0 
      ? ((currentMonthAppointments - lastMonthAppointments) / lastMonthAppointments * 100).toFixed(1)
      : currentMonthAppointments > 0 ? 100 : 0;

    return {
      totalAppointments,
      totalInquiries,
      appointmentGrowth,
      averageAppointments: (totalAppointments / 12).toFixed(1),
      averageInquiries: (totalInquiries / 12).toFixed(1)
    };
  };

  const stats = calculateStats();

  // Chart Configuration
  const appointmentsChartData = {
    labels: appointmentsData?.months || [],
    datasets: [
      {
        label: 'Appointments',
        data: appointmentsData?.totals || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const inquiriesChartData = {
    labels: inquiriesData?.months || [],
    datasets: [
      {
        label: 'Inquiries',
        data: inquiriesData?.totals || [],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      }
    ]
  };

  const combinedChartData = {
    labels: appointmentsData?.months || [],
    datasets: [
      {
        label: 'Appointments',
        data: appointmentsData?.totals || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Inquiries',
        data: inquiriesData?.totals || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const donutChartData = {
    labels: ['Doctors', 'Departments', 'News & Events'],
    datasets: [
      {
        data: [
          parseInt(countsData?.totaldoctors || 0),
          parseInt(countsData?.totaldepartments || 0),
          parseInt(countsData?.totalnewsevents || 0)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)'
        ],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const multiAxisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Loading State
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardData(year)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Hospital performance metrics and insights</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Year Selector */}
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Doctors */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {countsData?.totaldoctors || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active medical staff</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalAppointments || 0}
                </p>
                <div className="flex items-center mt-1">
                  {stats.appointmentGrowth > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">+{stats.appointmentGrowth}%</span>
                    </>
                  ) : stats.appointmentGrowth < 0 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-600">{stats.appointmentGrowth}%</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">No change</span>
                  )}
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Departments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {countsData?.totaldepartments || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Medical departments</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* News & Events */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">News & Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {countsData?.totalnewsevents || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Published items</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Newspaper className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointments Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Appointments</h3>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Avg: {stats.averageAppointments}/month
                </span>
              </div>
            </div>
            <div className="h-80">
              <Line data={appointmentsChartData} options={chartOptions} />
            </div>
          </div>

          {/* Inquiries Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Inquiries</h3>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">
                  Avg: {stats.averageInquiries}/month
                </span>
              </div>
            </div>
            <div className="h-80">
              <Bar data={inquiriesChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Combined and Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Combined Trends */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Combined Trends</h3>
              <p className="text-sm text-gray-600">Appointments vs Inquiries comparison</p>
            </div>
            <div className="h-80">
              <Line data={combinedChartData} options={multiAxisOptions} />
            </div>
          </div>

          {/* Resource Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Resource Distribution</h3>
              <p className="text-sm text-gray-600">Hospital resources overview</p>
            </div>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full">
                <Doughnut data={donutChartData} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Summary Table */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Summary - {year}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointments
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiries
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointmentsData?.months.map((month, index) => {
                  const appointments = appointmentsData.totals[index];
                  const inquiries = inquiriesData.totals[index];
                  const total = appointments + inquiries;
                  const isCurrentMonth = index === new Date().getMonth() && year === new Date().getFullYear();
                  
                  return (
                    <tr key={month} className={isCurrentMonth ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month}
                        {isCurrentMonth && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {appointments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {inquiries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {total > 0 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            No Activity
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                    {stats.totalAppointments}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                    {stats.totalInquiries}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                    {stats.totalAppointments + stats.totalInquiries}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {year} Summary
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;