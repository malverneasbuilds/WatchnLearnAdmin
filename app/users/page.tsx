'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, Download, MoreHorizontal, Eye, Edit, Trash2, Ban, CheckCircle } from 'lucide-react';

const initialUsers = [
  {
    id: 1,
    name: 'Tendai Mukamuri',
    email: 'tendai.m@email.com',
    school: 'Harare High School',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    lastActive: '2024-01-15',
    status: 'active',
    avatar: '/user1.jpg',
  },
  {
    id: 2,
    name: 'Chipo Nyahunzvi',
    email: 'chipo.n@email.com',
    school: 'St. Johns College',
    level: 'O-Level',
    examBoard: 'Cambridge',
    subjects: ['English', 'Mathematics', 'Biology'],
    lastActive: '2024-01-14',
    status: 'active',
    avatar: '/user2.jpg',
  },
  {
    id: 3,
    name: 'Tarisai Chimombe',
    email: 'tarisai.c@email.com',
    school: 'Prince Edward School',
    level: 'A-Level',
    examBoard: 'Cambridge',
    subjects: ['Mathematics', 'Further Mathematics', 'Physics'],
    lastActive: '2024-01-10',
    status: 'inactive',
    avatar: '/user3.jpg',
  },
  {
    id: 4,
    name: 'Rutendo Mashoko',
    email: 'rutendo.m@email.com',
    school: 'Dominican Convent High School',
    level: 'O-Level',
    examBoard: 'ZIMSEC',
    subjects: ['English', 'History', 'Geography'],
    lastActive: '2024-01-15',
    status: 'active',
    avatar: '/user4.jpg',
  },
];

const levelColors = {
  'JC': 'bg-blue-100 text-blue-800',
  'O-Level': 'bg-green-100 text-green-800',
  'A-Level': 'bg-purple-100 text-purple-800',
};

const statusColors = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-gray-100 text-gray-600',
  suspended: 'bg-destructive/10 text-destructive',
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedExamBoard, setSelectedExamBoard] = useState('all');
  const [users, setUsers] = useState(initialUsers);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.school.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || user.level === selectedLevel;
    const matchesExamBoard = selectedExamBoard === 'all' || user.examBoard === selectedExamBoard;
    
    return matchesSearch && matchesLevel && matchesExamBoard;
  });

  const handleUserAction = (userId: number, action: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'suspend':
            return { ...user, status: 'suspended' };
          case 'activate':
            return { ...user, status: 'active' };
          case 'delete':
            // In a real app, you'd probably want to show a confirmation dialog
            return null;
          default:
            return user;
        }
      }
      return user;
    }).filter(Boolean) as typeof initialUsers);
  };

  const handleViewUser = (userId: number) => {
    // In a real app, this would navigate to user details page
    console.log('Viewing user:', userId);
  };

  const handleEditUser = (userId: number) => {
    // In a real app, this would open an edit modal or navigate to edit page
    console.log('Editing user:', userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage student accounts and monitor user activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">24,847</div>
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-xs text-success mt-1">+12.5% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">18,432</div>
            <div className="text-sm text-gray-600">Active Users</div>
            <div className="text-xs text-success mt-1">+8.3% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-600">Schools</div>
            <div className="text-xs text-success mt-1">+3 new schools</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">73.8%</div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
            <div className="text-xs text-warning mt-1">-2.1% from last month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="JC">JC</SelectItem>
                <SelectItem value="O-Level">O-Level</SelectItem>
                <SelectItem value="A-Level">A-Level</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedExamBoard} onValueChange={setSelectedExamBoard}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Exam Board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                <SelectItem value="ZIMSEC">ZIMSEC</SelectItem>
                <SelectItem value="Cambridge">Cambridge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Exam Board</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.school}</TableCell>
                    <TableCell>
                      <Badge className={levelColors[user.level as keyof typeof levelColors]}>
                        {user.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.examBoard}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.subjects.slice(0, 2).map(subject => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {user.subjects.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{user.subjects.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="text-warning"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : user.status === 'suspended' ? (
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="text-success"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}