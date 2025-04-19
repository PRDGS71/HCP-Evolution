import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Goal as GolfBall, ArrowLeft } from 'lucide-react';
import { PlayerData } from '../types';

interface Props {
  players: PlayerData[];
}

export const PlayerDetail: React.FC<Props> = ({ players }) => {
  const { name } = useParams();
  const player = players.find((p) => p.name === name);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (!player) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-6">
          <ArrowLeft size={20} /> Back to Overview
        </Link>
        <div className="text-center text-gray-600">Player not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-6">
        <ArrowLeft size={20} /> Back to Overview
      </Link>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GolfBall className="text-green-600" size={24} />
          <h1 className="text-3xl font-bold">{player.name}'s Handicap History</h1>
        </div>
        <p className="text-gray-600">Last updated: {today}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Handicap</p>
            <p className="text-xl font-bold">{player.currentHandicap.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Lowest Handicap</p>
            <p className="text-xl font-bold">{player.lowestHandicap.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sandbagger Level</p>
            <p className="text-xl font-bold">
              {((player.currentHandicap - player.lowestHandicap) / player.lowestHandicap * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Handicap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Low HCP (365d)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {player.data.map((entry, index, array) => (
              <tr key={entry.revDate} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {array.length - index}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.revDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.Value.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.LowHI ? entry.LowHI.toFixed(1) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};