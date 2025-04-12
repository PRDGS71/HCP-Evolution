import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Goal as GolfBall } from 'lucide-react';
import { HandicapChart } from './components/HandicapChart';
import { PlayerDetail } from './components/PlayerDetail';
import { PlayerData } from './types';

const playerNames = ['Fábio', 'Pedro', 'Eduardo', 'Kleber'];

function App() {
  const [players, setPlayers] = useState<PlayerData[]>([]);

  useEffect(() => {
    const loadPlayerData = async () => {
      const playerData = await Promise.all(
        playerNames.map(async (name) => {
          const response = await fetch(`/${name.toLowerCase()}HCP.json`);
          const data = await response.json();
          const transformedData = data.handicap_revisions.map((revision: any) => ({
            revDate: revision.RevDate.split('T')[0],
            Value: parseFloat(revision.Value)
          })).filter((revision: any) => revision.Value !== 999.0);
          return { name, data: transformedData };
        })
      );
      setPlayers(playerData);
    };

    loadPlayerData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <GolfBall className="text-green-600" size={32} />
                  Handicap Evolution
                </h1>
                <div className="flex gap-4">
                  {playerNames.map((name) => (
                    <Link
                      key={name}
                      to={`/player/${name}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                {players.length > 0 ? (
                  <HandicapChart players={players} />
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          } />
          <Route path="/player/:name" element={<PlayerDetail players={players} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;