'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Search, Filter, Plus, BookOpen, Users, FileText } from 'lucide-react';
import { AddSubjectDialog } from '@/components/content/AddSubjectDialog';

const initialSubjects = [
  {
    id: 1,
    name: 'Mathematics',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    enrolledStudents: 2450,
    contentItems: 156,
    completionRate: 78,
    status: 'active',
    lastUpdated: '2024-01-15',
  },
  {
    id: 2,
    name: 'Physics',
    level: 'A-Level',
    examBoard: 'Cambridge',
    enrolledStudents: 1890,
    contentItems: 142,
    completionRate: 72,
    status: 'active',
    lastUpdated: '2024-01-14',
  },
  {
    id: 3,
    name: 'Chemistry',
    level: 'O-Level',
    examBoard: 'ZIMSEC',
    enrolledStudents: 3200,
    contentItems: 134,
    completionRate: 69,
    status: 'active',
    lastUpdated: '2024-01-13',
  },
  {
    id: 4,
    name: 'Biology',
    level: 'O-Level',
    examBoard: 'Cambridge',
    enrolledStudents: 2800,
    contentItems: 128,
    completionRate: 81,
    status: 'active',
    lastUpdated: '2024-01-12',
  },
  {
    id: 5,
    name: 'English',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    enrolledStudents: 4100,
    contentItems: 98,
    completionRate: 85,
    status: 'active',
    lastUpdated: '2024-01-11',
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
  draft: 'bg-warning/10 text-warning',
};

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedExamBoard, setSelectedExamBoard] = useState('all');
  const [subjects, setSubjects] = useState(initialSubjects);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || subject.level === selectedLevel;
    const matchesExamBoard = selectedExamBoard === 'all' || subject.examBoard === selectedExamBoard;
    
    return matchesSearch && matchesLevel && matchesExamBoard;
  });

  const handleSubjectAdded = (newSubject: any) => {
    setSubjects(prev => [newSubject, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
          <p className="text-gray-600 mt-2">Manage subjects across all levels and exam boards</p>
        </div>
        <AddSubjectDialog
          trigger={
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Subject</span>
            </Button>
          }
          onSubjectAdded={handleSubjectAdded}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{subjects.length}</div>
                <div className="text-sm text-gray-600">Total Subjects</div>
                <div className="text-xs text-success mt-1">+2 this month</div>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.reduce((acc, subject) => acc + subject.enrolledStudents, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
                <div className="text-xs text-success mt-1">+8.3% from last month</div>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full">
                <Users className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.reduce((acc, subject) => acc + subject.contentItems, 0)}
                </div>
                <div className="text-sm text-gray-600">Content Items</div>
                <div className="text-xs text-success mt-1">+47 this week</div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(subjects.reduce((acc, subject) => acc + subject.completionRate, 0) / subjects.length).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Avg. Completion</div>
                <div className="text-xs text-success mt-1">+3.1% from last month</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Subjects</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search subjects..."
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
                  <TableHead>Subject</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Exam Board</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Content Items</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject) => (
                  <TableRow key={subject.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="font-medium text-gray-900">{subject.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={levelColors[subject.level as keyof typeof levelColors]}>
                        {subject.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subject.examBoard}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {subject.enrolledStudents.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {subject.contentItems}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-success h-2 rounded-full" 
                            style={{ width: `${subject.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{subject.completionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[subject.status as keyof typeof statusColors]}>
                        {subject.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(subject.lastUpdated).toLocaleDateString()}
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