import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Goal as GolfBall } from 'lucide-react';
import { PlayerData } from '../types';

interface Props {
  players: PlayerData[];
}

export const PlayerDetail: React.FC<Props> = ({ players }) => {
  const { name } = useParams();
  const player = players.find((p) => p.name === name);

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-6">
        <GolfBall size={20} /> Back to Overview
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">{player.name}'s Handicap History</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Handicap
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Low HI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {player.data.map((entry) => (
              <tr key={entry.revDate}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.revDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.Value.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.LowHI !== '999.0' ? entry.LowHI : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};