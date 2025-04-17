import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { PlayerData } from '../types';

const colors = ['#2563eb', '#dc2626', '#16a34a', '#9333ea'];

interface Props {
  players: PlayerData[];
}

export const HandicapChart: React.FC<Props> = ({ players }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const allData = players.reduce((acc: any[], player) => {
    player.data.forEach((entry) => {
      const date = new Date(entry.revDate);
      const existingEntry = acc.find((d) => d.date === entry.revDate);
      
      if (existingEntry) {
        existingEntry[player.name] = entry.Value;
      } else {
        acc.push({
          date: entry.revDate,
          [player.name]: entry.Value,
        });
      }
    });
    return acc.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const filteredData = allData.filter((entry) => {
    const date = new Date(entry.date);
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });

  return (
    <div className="w-full h-[600px] p-4">
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']}
            label={{ value: 'Handicap Index', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
          />
          <Legend verticalAlign="top" height={36} />
          <Brush dataKey="date" height={30} stroke="#8884d8" />
          {players.map((player, index) => (
            <Line
              key={player.name}
              type="monotone"
              dataKey={player.name}
              stroke={colors[index]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              name={player.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};