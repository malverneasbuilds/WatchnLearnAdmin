'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, BookOpen, FileText, GraduationCap } from 'lucide-react';

const metrics = [
  {
    title: 'Total Active Users',
    value: '24,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    description: 'Active users this month',
  },
  {
    title: 'Content Items',
    value: '8,429',
    change: '+3.2%',
    trend: 'up',
    icon: BookOpen,
    description: 'Published content pieces',
  },
  {
    title: 'Past Papers',
    value: '1,247',
    change: '+8.1%',
    trend: 'up',
    icon: FileText,
    description: 'Examination papers available',
  },
  {
    title: 'Course Completion',
    value: '73.8%',
    change: '-2.3%',
    trend: 'down',
    icon: GraduationCap,
    description: 'Average completion rate',
  },
];

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {metric.change}
                </div>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}