'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings, 
  Users, 
  Database, 
  Shield, 
  Bell, 
  Mail, 
  Server, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const systemMetrics = [
  { name: 'CPU Usage', value: '45%', status: 'normal', icon: Cpu },
  { name: 'Memory Usage', value: '67%', status: 'warning', icon: MemoryStick },
  { name: 'Disk Usage', value: '23%', status: 'normal', icon: HardDrive },
  { name: 'Active Users', value: '1,247', status: 'normal', icon: Users },
];

const adminUsers = [
  {
    id: 1,
    name: 'John Admin',
    email: 'john@watchnlearn.com',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
    permissions: ['all'],
  },
  {
    id: 2,
    name: 'Sarah Manager',
    email: 'sarah@watchnlearn.com',
    role: 'content_manager',
    status: 'active',
    lastLogin: '2024-01-15 09:15',
    permissions: ['content', 'media'],
  },
  {
    id: 3,
    name: 'Mike Analyst',
    email: 'mike@watchnlearn.com',
    role: 'analytics_viewer',
    status: 'active',
    lastLogin: '2024-01-14 16:45',
    permissions: ['analytics'],
  },
];

const auditLogs = [
  {
    id: 1,
    user: 'John Admin',
    action: 'User Created',
    resource: 'Admin User: Sarah Manager',
    timestamp: '2024-01-15 14:30:25',
    status: 'success',
  },
  {
    id: 2,
    user: 'Sarah Manager',
    action: 'Content Published',
    resource: 'Mathematics: Calculus Introduction',
    timestamp: '2024-01-15 12:15:10',
    status: 'success',
  },
  {
    id: 3,
    user: 'System',
    action: 'Backup Failed',
    resource: 'Database Backup',
    timestamp: '2024-01-15 03:00:00',
    status: 'error',
  },
];

const roleColors = {
  super_admin: 'bg-red-100 text-red-800',
  content_manager: 'bg-blue-100 text-blue-800',
  analytics_viewer: 'bg-green-100 text-green-800',
};

const statusColors = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-gray-100 text-gray-600',
  suspended: 'bg-destructive/10 text-destructive',
};

const logStatusColors = {
  success: 'bg-success/10 text-success',
  error: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
};

export default function SystemPage() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    backupEnabled: true,
    autoBackupInterval: '24',
    maxFileSize: '100',
    sessionTimeout: '30',
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-600 mt-2">Manage system settings, users, and monitor platform health</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={settings.maintenanceMode ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}>
            {settings.maintenanceMode ? 'Maintenance Mode' : 'System Online'}
          </Badge>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.name}</div>
                    <div className={`text-xs mt-1 ${
                      metric.status === 'normal' ? 'text-success' : 
                      metric.status === 'warning' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {metric.status === 'normal' ? 'Normal' : 
                       metric.status === 'warning' ? 'Warning' : 'Critical'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${
                    metric.status === 'normal' ? 'bg-success/10' : 
                    metric.status === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      metric.status === 'normal' ? 'text-success' : 
                      metric.status === 'warning' ? 'text-warning' : 'text-destructive'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="users">Admin Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>General Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Temporarily disable user access</p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration">User Registration</Label>
                    <p className="text-sm text-gray-500">Allow new user registrations</p>
                  </div>
                  <Switch
                    id="registration"
                    checked={settings.userRegistration}
                    onCheckedChange={(checked) => handleSettingChange('userRegistration', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileSize">Max File Size (MB)</Label>
                  <Input
                    id="fileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Backup & Storage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="backup">Automatic Backups</Label>
                    <p className="text-sm text-gray-500">Enable scheduled backups</p>
                  </div>
                  <Switch
                    id="backup"
                    checked={settings.backupEnabled}
                    onCheckedChange={(checked) => handleSettingChange('backupEnabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupInterval">Backup Interval (hours)</Label>
                  <Select 
                    value={settings.autoBackupInterval} 
                    onValueChange={(value) => handleSettingChange('autoBackupInterval', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">Every 6 hours</SelectItem>
                      <SelectItem value="12">Every 12 hours</SelectItem>
                      <SelectItem value="24">Daily</SelectItem>
                      <SelectItem value="168">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup Now
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Last backup: January 15, 2024 at 3:00 AM</p>
                  <p>Backup size: 2.4 GB</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admin Users</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map(permission => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for admin users</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-gray-500">Restrict admin access by IP</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Require uppercase and lowercase</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Require numbers and symbols</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send system alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alert Recipients</Label>
                  <Textarea
                    placeholder="admin@watchnlearn.com, tech@watchnlearn.com"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alert Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="system-errors" defaultChecked />
                      <Label htmlFor="system-errors">System Errors</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="security-alerts" defaultChecked />
                      <Label htmlFor="security-alerts">Security Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="backup-status" defaultChecked />
                      <Label htmlFor="backup-status">Backup Status</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <p className="text-sm text-gray-600">Track all system activities and changes</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-sm text-gray-600">{log.resource}</TableCell>
                        <TableCell className="text-sm text-gray-600">{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge className={logStatusColors[log.status as keyof typeof logStatusColors]}>
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}