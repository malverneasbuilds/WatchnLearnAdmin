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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus, Upload, MoreHorizontal, BookOpen, Video, FileText } from 'lucide-react';
import { AddContentDialog } from '@/components/content/AddContentDialog';
import { ContentHierarchy } from '@/components/content/ContentHierarchy';

const initialSubjects = [
  {
    id: 1,
    name: 'Chemistry',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    terms: [
      {
        id: 1,
        title: 'Term 1',
        order: 1,
        weeks: [
          {
            id: 1,
            title: 'Week 1',
            order: 1,
            chapters: [
              {
                id: 1,
                title: 'Introduction to Organic Chemistry',
                order: 1,
                topics: [
                  { id: '1', title: 'Hydrocarbons', type: 'video', order: 1 },
                  { id: '2', title: 'Alkanes', type: 'pdf', order: 2 },
                  { id: '3', title: 'Alkenes', type: 'video', order: 3 },
                  { id: '4', title: 'Alkynes Quiz', type: 'quiz', order: 4 },
                ]
              }
            ]
          },
          {
            id: 2,
            title: 'Week 2',
            order: 2,
            chapters: []
          },
          // Generate remaining weeks for Term 1
          ...Array.from({ length: 11 }, (_, i) => ({
            id: i + 3,
            title: `Week ${i + 3}`,
            order: i + 3,
            chapters: []
          }))
        ]
      },
      {
        id: 2,
        title: 'Term 2',
        order: 2,
        weeks: Array.from({ length: 13 }, (_, i) => ({
          id: i + 14,
          title: `Week ${i + 1}`,
          order: i + 1,
          chapters: []
        }))
      },
      {
        id: 3,
        title: 'Term 3',
        order: 3,
        weeks: Array.from({ length: 13 }, (_, i) => ({
          id: i + 27,
          title: `Week ${i + 1}`,
          order: i + 1,
          chapters: []
        }))
      }
    ]
  },
  {
    id: 2,
    name: 'Mathematics',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    terms: [
      {
        id: 1,
        title: 'Term 1',
        order: 1,
        weeks: Array.from({ length: 13 }, (_, i) => ({
          id: i + 40,
          title: `Week ${i + 1}`,
          order: i + 1,
          chapters: []
        }))
      },
      {
        id: 2,
        title: 'Term 2',
        order: 2,
        weeks: Array.from({ length: 13 }, (_, i) => ({
          id: i + 53,
          title: `Week ${i + 1}`,
          order: i + 1,
          chapters: []
        }))
      },
      {
        id: 3,
        title: 'Term 3',
        order: 3,
        weeks: Array.from({ length: 13 }, (_, i) => ({
          id: i + 66,
          title: `Week ${i + 1}`,
          order: i + 1,
          chapters: []
        }))
      }
    ]
  }
];

const contentItems = [
  {
    id: 1,
    title: 'Introduction to Calculus',
    subject: 'Mathematics',
    type: 'video',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    status: 'published',
    views: 2450,
    duration: '15:30',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
  },
  {
    id: 2,
    title: 'Organic Chemistry Basics',
    subject: 'Chemistry',
    type: 'pdf',
    level: 'O-Level',
    examBoard: 'Cambridge',
    status: 'draft',
    views: 0,
    pages: 24,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-15',
  },
  {
    id: 3,
    title: 'Mechanics Quiz',
    subject: 'Physics',
    type: 'quiz',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    status: 'published',
    views: 1890,
    questions: 20,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: 4,
    title: 'Shakespeare Analysis',
    subject: 'English',
    type: 'video',
    level: 'O-Level',
    examBoard: 'Cambridge',
    status: 'review',
    views: 0,
    duration: '22:15',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-14',
  },
];

const statusColors = {
  published: 'bg-success/10 text-success',
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-warning/10 text-warning',
  archived: 'bg-destructive/10 text-destructive',
};

const typeIcons = {
  video: Video,
  pdf: FileText,
  quiz: BookOpen,
};

const levelColors = {
  'JC': 'bg-blue-100 text-blue-800',
  'O-Level': 'bg-green-100 text-green-800',
  'A-Level': 'bg-purple-100 text-purple-800',
};

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [content, setContent] = useState(contentItems);
  const [subjects, setSubjects] = useState(initialSubjects);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleContentAdded = (newContent: any) => {
    setContent(prev => [newContent, ...prev]);
  };

  const handleSubjectAdded = (newSubject: any) => {
    setSubjects(prev => [...prev, newSubject]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Manage educational content across all subjects and levels</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Bulk Upload</span>
          </Button>
          <AddContentDialog
            trigger={
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Content</span>
              </Button>
            }
            onContentAdded={handleContentAdded}
            subjects={subjects}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">8,429</div>
            <div className="text-sm text-gray-600">Total Content</div>
            <div className="text-xs text-success mt-1">+47 this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">6,234</div>
            <div className="text-sm text-gray-600">Published</div>
            <div className="text-xs text-success mt-1">73.8% of total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-600">In Review</div>
            <div className="text-xs text-warning mt-1">14.8% of total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">948</div>
            <div className="text-sm text-gray-600">Drafts</div>
            <div className="text-xs text-gray-500 mt-1">11.2% of total</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Content List</TabsTrigger>
          <TabsTrigger value="hierarchy">Content Hierarchy</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Content</CardTitle>
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
                    placeholder="Search content by title, subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((item) => {
                      const TypeIcon = typeIcons[item.type as keyof typeof typeIcons];
                      return (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-primary/10 rounded-md">
                                <TypeIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-500">
                                  {item.type === 'video' && `${item.duration}`}
                                  {item.type === 'pdf' && `${item.pages} pages`}
                                  {item.type === 'quiz' && `${item.questions} questions`}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.subject}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={levelColors[item.level as keyof typeof levelColors]}>
                              {item.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {item.views.toLocaleString()} views
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy">
          <ContentHierarchy subjects={subjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}