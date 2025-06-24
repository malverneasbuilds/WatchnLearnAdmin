'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, UserPlus, Upload } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'content_upload',
    icon: Upload,
    title: 'New content uploaded',
    description: 'Mathematics Chapter 5: Calculus',
    user: 'Sarah Johnson',
    time: '2 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'user_registration',
    icon: UserPlus,
    title: 'New user registered',
    description: 'Student from Harare High School',
    user: 'System',
    time: '15 minutes ago',
    status: 'info',
  },
  {
    id: 3,
    type: 'content_published',
    icon: BookOpen,
    title: 'Content published',
    description: 'Physics A-Level Term 2 materials',
    user: 'Mike Chen',
    time: '1 hour ago',
    status: 'success',
  },
  {
    id: 4,
    type: 'past_paper_added',
    icon: FileText,
    title: 'Past paper added',
    description: '2023 O-Level Mathematics Paper 1',
    user: 'Lisa Williams',
    time: '2 hours ago',
    status: 'success',
  },
  {
    id: 5,
    type: 'content_review',
    icon: BookOpen,
    title: 'Content under review',
    description: 'Chemistry practical experiments',
    user: 'David Brown',
    time: '3 hours ago',
    status: 'warning',
  },
];

const statusColors = {
  success: 'bg-success',
  info: 'bg-primary',
  warning: 'bg-warning',
  error: 'bg-destructive',
};

export function RecentActivity() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-gray-600">Latest platform activities and updates</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${statusColors[activity.status as keyof typeof statusColors]}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">by {activity.user}</span>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
        <div className="pt-4 border-t">
          <button className="w-full text-sm text-primary hover:text-primary/80 font-medium">
            View all activities →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}