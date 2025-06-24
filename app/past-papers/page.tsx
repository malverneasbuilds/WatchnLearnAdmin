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
import { Search, Filter, Plus, Upload, Download, FileText, Eye, MoreHorizontal } from 'lucide-react';
import { AddPastPaperDialog } from '@/components/content/AddPastPaperDialog';

const initialPastPapers = [
  {
    id: 1,
    subject: 'Mathematics',
    year: 2023,
    paperType: 'Paper 1',
    level: 'A-Level',
    examBoard: 'ZIMSEC',
    status: 'published',
    downloadCount: 1250,
    hasMarkingScheme: true,
    uploadedAt: '2024-01-15',
    fileSize: '2.4 MB',
  },
  {
    id: 2,
    subject: 'Physics',
    year: 2023,
    paperType: 'Paper 2',
    level: 'A-Level',
    examBoard: 'Cambridge',
    status: 'published',
    downloadCount: 890,
    hasMarkingScheme: true,
    uploadedAt: '2024-01-14',
    fileSize: '3.1 MB',
  },
  {
    id: 3,
    subject: 'Chemistry',
    year: 2022,
    paperType: 'Paper 1',
    level: 'O-Level',
    examBoard: 'ZIMSEC',
    status: 'published',
    downloadCount: 2100,
    hasMarkingScheme: false,
    uploadedAt: '2024-01-13',
    fileSize: '1.8 MB',
  },
  {
    id: 4,
    subject: 'Biology',
    year: 2023,
    paperType: 'Paper 3',
    level: 'O-Level',
    examBoard: 'Cambridge',
    status: 'review',
    downloadCount: 0,
    hasMarkingScheme: true,
    uploadedAt: '2024-01-12',
    fileSize: '2.7 MB',
  },
];

const levelColors = {
  'JC': 'bg-blue-100 text-blue-800',
  'O-Level': 'bg-green-100 text-green-800',
  'A-Level': 'bg-purple-100 text-purple-800',
};

const statusColors = {
  published: 'bg-success/10 text-success',
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-warning/10 text-warning',
  archived: 'bg-destructive/10 text-destructive',
};

export default function PastPapersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [pastPapers, setPastPapers] = useState(initialPastPapers);

  const filteredPapers = pastPapers.filter(paper => {
    const matchesSearch = paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.paperType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || paper.level === selectedLevel;
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;
    
    return matchesSearch && matchesSubject && matchesLevel && matchesYear;
  });

  const subjects = [...new Set(pastPapers.map(paper => paper.subject))];
  const years = [...new Set(pastPapers.map(paper => paper.year))].sort((a, b) => b - a);

  const handlePaperAdded = (newPaper: any) => {
    setPastPapers(prev => [newPaper, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Past Papers</h1>
          <p className="text-gray-600 mt-2">Manage examination papers and marking schemes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Bulk Upload</span>
          </Button>
          <AddPastPaperDialog
            trigger={
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Paper</span>
              </Button>
            }
            onPaperAdded={handlePaperAdded}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{pastPapers.length}</div>
            <div className="text-sm text-gray-600">Total Papers</div>
            <div className="text-xs text-success mt-1">+8 this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {pastPapers.reduce((acc, paper) => acc + paper.downloadCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Downloads</div>
            <div className="text-xs text-success mt-1">+12.3% this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {pastPapers.filter(paper => paper.hasMarkingScheme).length}
            </div>
            <div className="text-sm text-gray-600">With Marking Schemes</div>
            <div className="text-xs text-gray-500 mt-1">
              {((pastPapers.filter(paper => paper.hasMarkingScheme).length / pastPapers.length) * 100).toFixed(1)}% coverage
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{years.length}</div>
            <div className="text-sm text-gray-600">Years Available</div>
            <div className="text-xs text-gray-500 mt-1">{Math.min(...years)} - {Math.max(...years)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Past Papers</CardTitle>
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
                placeholder="Search papers by subject or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="JC">JC</SelectItem>
                <SelectItem value="O-Level">O-Level</SelectItem>
                <SelectItem value="A-Level">A-Level</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paper Details</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Exam Board</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Marking Scheme</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPapers.map((paper) => (
                  <TableRow key={paper.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {paper.year} {paper.paperType}
                          </div>
                          <div className="text-sm text-gray-500">
                            {paper.fileSize} • Uploaded {new Date(paper.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{paper.subject}</TableCell>
                    <TableCell>
                      <Badge className={levelColors[paper.level as keyof typeof levelColors]}>
                        {paper.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{paper.examBoard}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{paper.downloadCount.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {paper.hasMarkingScheme ? (
                        <Badge className="bg-success/10 text-success">Available</Badge>
                      ) : (
                        <Badge variant="outline">Not Available</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[paper.status as keyof typeof statusColors]}>
                        {paper.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
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
    </div>
  );
}