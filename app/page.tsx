'use client';

import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UserEngagement } from '@/components/dashboard/UserEngagement';
import { ContentPerformance } from '@/components/dashboard/ContentPerformance';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <MetricsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserEngagement />
        <ContentPerformance />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardOverview />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}