'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { date: '2024-01-01', users: 1200, sessions: 2400, pageViews: 4800 },
  { date: '2024-01-02', users: 1380, sessions: 2680, pageViews: 5200 },
  { date: '2024-01-03', users: 1580, sessions: 3200, pageViews: 6100 },
  { date: '2024-01-04', users: 1420, sessions: 2900, pageViews: 5800 },
  { date: '2024-01-05', users: 1680, sessions: 3400, pageViews: 6800 },
  { date: '2024-01-06', users: 1890, sessions: 3800, pageViews: 7200 },
  { date: '2024-01-07', users: 2100, sessions: 4200, pageViews: 8100 },
  { date: '2024-01-08', users: 1950, sessions: 3900, pageViews: 7500 },
  { date: '2024-01-09', users: 2200, sessions: 4400, pageViews: 8400 },
  { date: '2024-01-10', users: 2350, sessions: 4700, pageViews: 9100 },
  { date: '2024-01-11', users: 2180, sessions: 4360, pageViews: 8800 },
  { date: '2024-01-12', users: 2420, sessions: 4840, pageViews: 9200 },
  { date: '2024-01-13', users: 2650, sessions: 5300, pageViews: 10200 },
  { date: '2024-01-14', users: 2480, sessions: 4960, pageViews: 9800 },
];

export function DashboardOverview() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Platform Activity Overview</CardTitle>
        <p className="text-sm text-gray-600">Daily platform usage metrics over the last 14 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                formatter={(value, name) => [
                  value.toLocaleString(),
                  name === 'users' ? 'Active Users' : name === 'sessions' ? 'Sessions' : 'Page Views'
                ]}
              />
              <Area
                type="monotone"
                dataKey="pageViews"
                stackId="1"
                stroke="hsl(var(--success))"
                fill="url(#colorPageViews)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stackId="1"
                stroke="hsl(var(--secondary))"
                fill="url(#colorSessions)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="users"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}