import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const WeightVisualization = ({ isWidget = false }) => {
  const [weightData, setWeightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [timeRange, setTimeRange] = useState(isWidget ? '30d' : '90d');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Then fetch weight data once we have the user
  useEffect(() => {
    const fetchWeightData = async () => {
      // Don't proceed if no user
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Calculate date range based on selected timeRange
        const startDate = new Date();

        switch (timeRange) {
          case '12m':
            startDate.setMonth(startDate.getMonth() - 12);
            break;
          case '6m':
            startDate.setMonth(startDate.getMonth() - 6);
            break;
          case '90d':
            startDate.setDate(startDate.getDate() - 90);
            break;
          case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
          case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
          default:
            startDate.setDate(startDate.getDate() - 90);
        }

        const startDateString = startDate.toISOString().split('T')[0];

        const db = getFirestore();
        const weightCollection = collection(db, 'weightLogs');

        // Build query constraints array
        const queryConstraints = [
          where('userId', '==', user.uid),
          where('date', '>=', startDateString),
          orderBy('date', 'asc'),
        ];

        // Only add limit if isWidget is true
        if (isWidget) {
          queryConstraints.push(limit(30));
        }

        // Create the query with the constraints array
        const weightQuery = query(weightCollection, ...queryConstraints);

        const querySnapshot = await getDocs(weightQuery);

        const data = [];
        querySnapshot.forEach((doc) => {
          const weightLog = doc.data();
          data.push({
            date: weightLog.date,
            weight: weightLog.weight,
            // Format date for display
            formattedDate: new Date(weightLog.date).toLocaleDateString(
              'no-NO',
              {
                day: 'numeric',
                month: 'short',
              }
            ),
          });
        });

        setWeightData(data);
      } catch (err) {
        console.error('Error fetching weight data:', err);
        setError('Kunne ikke hente vektdata. Prøv igjen senere.');
      }

      setLoading(false);
    };

    fetchWeightData();
  }, [timeRange, isWidget, user]); // Added user dependency

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setExpanded(false);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '12m':
        return 'Siste 12 måneder';
      case '6m':
        return 'Siste 6 måneder';
      case '90d':
        return 'Siste 90 dager';
      case '30d':
        return 'Siste måned';
      case '7d':
        return 'Siste uke';
      default:
        return 'Siste 90 dager';
    }
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-medium">{payload[0].payload.formattedDate}</p>
          <p className="text-[#E64D20]">{`Vekt: ${payload[0].value} kg`}</p>
        </div>
      );
    }
    return null;
  };

  const calculateMinMaxWeight = () => {
    if (weightData.length === 0) return { min: 0, max: 100 };

    let minWeight = Math.min(...weightData.map((data) => data.weight));
    let maxWeight = Math.max(...weightData.map((data) => data.weight));

    const padding = (maxWeight - minWeight) * 0.1;
    minWeight = Math.max(0, minWeight - padding);
    maxWeight = maxWeight + padding;

    return { min: minWeight, max: maxWeight };
  };

  const { min: minWeight, max: maxWeight } = calculateMinMaxWeight();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E64D20]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-700 mb-3">
          Du må være innlogget for å se vektlogg.
        </p>
        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white px-4 py-2 rounded-lg"
        >
          Logg inn
        </Link>
      </div>
    );
  }

  const renderWidgetView = () => {
    return (
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Vektlogg</h2>
          <Link
            to="/weight-tracker"
            className="text-sm text-[#E64D20] hover:underline"
          >
            Se full logg
          </Link>
        </div>

        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : weightData.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-gray-500">Ingen vektdata registrert</p>
            <Link
              to="/weight-tracker"
              className="block mt-2 text-sm text-[#E64D20] hover:underline"
            >
              Logg vekt
            </Link>
          </div>
        ) : (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <YAxis
                  domain={[minWeight, maxWeight]}
                  width={30}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#E64D20"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#E64D20' }}
                  activeDot={{ r: 5 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {weightData.length > 0 && (
          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{getTimeRangeLabel()}</p>
            </div>
            {weightData.length >= 2 && (
              <div className="text-right">
                <p className="text-sm font-medium">
                  {weightData[weightData.length - 1].weight} kg
                </p>
                <p
                  className={`text-xs ${
                    weightData[weightData.length - 1].weight <
                    weightData[0].weight
                      ? 'text-green-500'
                      : weightData[weightData.length - 1].weight >
                          weightData[0].weight
                        ? 'text-red-500'
                        : 'text-gray-500'
                  }`}
                >
                  {weightData[weightData.length - 1].weight <
                  weightData[0].weight
                    ? `↓ ${(weightData[0].weight - weightData[weightData.length - 1].weight).toFixed(1)} kg`
                    : weightData[weightData.length - 1].weight >
                        weightData[0].weight
                      ? `↑ ${(weightData[weightData.length - 1].weight - weightData[0].weight).toFixed(1)} kg`
                      : 'Ingen endring'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFullView = () => {
    return (
      <div
        className="relative bg-white rounded-lg shadow"
        onClick={() => !expanded && setExpanded(true)}
      >
        <div
          className={`p-4 transition-all duration-300 ${expanded ? 'pb-20' : ''}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Vektlogg</h2>
            <div
              className="flex items-center text-gray-500 hover:text-[#E64D20] transition cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              <span>{getTimeRangeLabel()}</span>
              {expanded ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </div>
          </div>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : weightData.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">
              Ingen vektdata tilgjengelig for valgt periode.
            </p>
          ) : (
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickMargin={5}
                  />
                  <YAxis domain={[minWeight, maxWeight]} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#E64D20"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#E64D20' }}
                    activeDot={{ r: 5 }}
                    animationDuration={500}
                  />
                  {weightData.length >= 2 && (
                    <ReferenceLine
                      y={weightData[0].weight}
                      stroke="#888"
                      strokeDasharray="3 3"
                      label={{
                        value: 'Start',
                        position: 'insideTopLeft',
                        fill: '#888',
                        fontSize: 12,
                      }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {expanded && (
            <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 px-4">
              <button
                onClick={() => handleTimeRangeChange('7d')}
                className={`px-3 py-1 rounded-full text-sm ${timeRange === '7d' ? 'bg-[#E64D20] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Siste uke
              </button>
              <button
                onClick={() => handleTimeRangeChange('30d')}
                className={`px-3 py-1 rounded-full text-sm ${timeRange === '30d' ? 'bg-[#E64D20] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Siste måned
              </button>
              <button
                onClick={() => handleTimeRangeChange('90d')}
                className={`px-3 py-1 rounded-full text-sm ${timeRange === '90d' ? 'bg-[#E64D20] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Siste 90 dager
              </button>
              <button
                onClick={() => handleTimeRangeChange('6m')}
                className={`px-3 py-1 rounded-full text-sm ${timeRange === '6m' ? 'bg-[#E64D20] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Siste 6 måneder
              </button>
              <button
                onClick={() => handleTimeRangeChange('12m')}
                className={`px-3 py-1 rounded-full text-sm ${timeRange === '12m' ? 'bg-[#E64D20] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Siste 12 måneder
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return isWidget ? renderWidgetView() : renderFullView();
};

export default WeightVisualization;
