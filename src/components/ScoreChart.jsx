import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ScoreChart({ completedTests }) {
  const data = useMemo(() => {
    if (!completedTests) return [];
    
    // Convert dictionary to array
    const testsArray = Object.values(completedTests);
    
    // Sort by date (oldest to newest)
    testsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return testsArray.map((test, index) => {
      const dateObj = new Date(test.date);
      return {
        name: `Test ${index + 1}`,
        date: `${dateObj.getMonth() + 1}/${dateObj.getDate()}`,
        score: test.scaledScore || test.score || 0
      };
    }).filter(item => item.score > 0);
  }, [completedTests]);

  if (data.length === 0) {
    return (
      <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
        <h3 className="text-xl font-bold text-white mb-2">Score History</h3>
        <p className="text-zinc-400">Take a practice test to see your score history!</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
      <h3 className="text-xl font-bold text-white mb-4">Score History Trend</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
            <XAxis dataKey="date" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} />
            <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} domain={[400, 1600]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#27272a', borderColor: '#3f3f46', color: '#fff' }}
              itemStyle={{ color: '#38bdf8' }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#38bdf8" 
              strokeWidth={3}
              activeDot={{ r: 8 }} 
              dot={{ r: 4, fill: '#38bdf8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
