import { Suspense } from "react";

interface RankingData {
  id?: string;
  name: string;
  database_model: string;
  database_id: string;
  position?: number;
}

async function getRankingsData(): Promise<RankingData[]> {
  try {
    const response = await fetch(
      "https://b8iy915ig0.execute-api.eu-west-1.amazonaws.com/dev/get-rankings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: "2025-08-30",
          endDate: "2025-09-01",
        }),
        cache: 'no-store', // Ensures fresh data on each request
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching rankings data:", error);
    return [];
  }
}

function RankingsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

// Remove async from this component since it's receiving data as props
function RankingsTable({ rankings }: { rankings: RankingData[] }) {
  if (rankings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No rankings data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Model
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rankings.map((ranking, index) => (
            <tr key={ranking.id || `ranking-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    (ranking.position || index + 1) <= 3
                      ? "bg-green-100 text-green-800"
                      : (ranking.position || index + 1) <= 10
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ranking.position || index + 1}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {ranking.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {ranking.database_model}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {ranking.database_id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// This is the async Server Component
async function RankingsContent({rankings}: {rankings: RankingData[]}) {
  
  return <RankingsTable rankings={rankings} />;
}

export default async function Page() {
  const rankings = await getRankingsData()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            DB Rankings Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Real-time search engine rankings data
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Current Rankings
            </h2>
            <p className="text-sm text-gray-500">
              Data fetched with full Server-Side Rendering (SSR)
            </p>
          </div>

          <Suspense fallback={<RankingsTableSkeleton />}>
            <RankingsContent rankings={rankings} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
