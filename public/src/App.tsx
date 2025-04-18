import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Goal as GolfBall } from 'lucide-react';
import { HandicapChart } from './components/HandicapChart';
import { PlayerDetail } from './components/PlayerDetail';
import { PlayerData } from './types';

const playerNames = ['Fábio', 'Pedro', 'Eduardo', 'Kleber'];

function App() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const loadPlayerData = async () => {
      const playerData = await Promise.all(
        playerNames.map(async (name) => {
          const fileName = name.replace('á', 'a').toLowerCase();
          const response = await fetch(`/${fileName}HCP.json`);
          const data = await response.json();
          const transformedData = data.handicap_revisions
            .filter((revision: any) => 
              revision.Value !== 999.0 && 
              revision.Value !== '999.0' &&
              revision.Value !== 99.9 && 
              revision.Value !== '99.9'
            )
            .map((revision: any) => ({
              revDate: revision.RevDate.split('T')[0],
              Value: parseFloat(revision.Value),
              LowHI: parseFloat(revision.LowHI) === 999.0 ? null : parseFloat(revision.LowHI)
            }))
            .sort((a: any, b: any) => new Date(b.revDate).getTime() - new Date(a.revDate).getTime());
          
          const lowestHI = data.handicap_revisions
            .filter((revision: any) => 
              revision.LowHI !== '999.0' && 
              revision.LowHI !== '-' && 
              revision.LowHI !== null
            )
            .reduce((min: number, revision: any) => {
              const value = parseFloat(revision.LowHI);
              return value < min ? value : min;
            }, Infinity);

          return { 
            name, 
            data: transformedData,
            currentHandicap: transformedData[0]?.Value || 0,
            lowestHandicap: lowestHI === Infinity ? 0 : lowestHI
          };
        })
      );
      setPlayers(playerData);
    };

    loadPlayerData();
  }, []);

  const calculateSandbaggerLevel = (current: number, lowest: number) => {
    if (lowest === 0) return 0;
    return ((current - lowest) / lowest) * 100;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                    <GolfBall className="text-green-600" size={32} />
                    Handicap Evolution
                  </h1>
                  <p className="text-gray-600">Last updated: {today}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                {players.map((player) => (
                  <div key={player.name} className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-bold mb-2">{player.name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        Current HCP: <span className="font-bold">{player.currentHandicap.toFixed(1)}</span>
                      </p>
                      <p className="text-sm">
                        Lowest HCP: <span className="font-bold">{player.lowestHandicap.toFixed(1)}</span>
                      </p>
                      <p className="text-sm">
                        Sandbagger Level: <span className="font-bold">
                          {calculateSandbaggerLevel(player.currentHandicap, player.lowestHandicap).toFixed(1)}%
                        </span>
                      </p>
                      <Link
                        to={`/player/${player.name}`}
                        className="text-blue-600 hover:text-blue-800 font-medium block text-sm"
                      >
                        Evolution
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                {players.length > 0 ? (
                  <HandicapChart players={players.map(p => ({
                    ...p,
                    data: [...p.data].reverse() // Reverse back for chart display
                  }))} />
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