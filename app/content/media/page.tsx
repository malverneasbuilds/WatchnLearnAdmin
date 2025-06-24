'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Upload, 
  Grid3X3, 
  List, 
  MoreHorizontal, 
  Play, 
  FileText, 
  Image,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { UploadMediaDialog } from '@/components/content/UploadMediaDialog';

const initialMediaItems = [
  {
    id: 1,
    name: 'Calculus Introduction Video',
    type: 'video',
    size: '45.2 MB',
    duration: '15:30',
    format: 'MP4',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-01-15',
    subject: 'Mathematics',
    level: 'A-Level',
    views: 2450,
    thumbnail: '/video-thumb-1.jpg',
    status: 'published',
  },
  {
    id: 2,
    name: 'Organic Chemistry Diagram',
    type: 'image',
    size: '2.1 MB',
    dimensions: '1920x1080',
    format: 'PNG',
    uploadedBy: 'Mike Chen',
    uploadedAt: '2024-01-14',
    subject: 'Chemistry',
    level: 'O-Level',
    views: 890,
    thumbnail: '/image-thumb-1.jpg',
    status: 'published',
  },
  {
    id: 3,
    name: 'Physics Formulas Reference',
    type: 'pdf',
    size: '8.7 MB',
    pages: 24,
    format: 'PDF',
    uploadedBy: 'Lisa Williams',
    uploadedAt: '2024-01-13',
    subject: 'Physics',
    level: 'A-Level',
    views: 1560,
    thumbnail: '/pdf-thumb-1.jpg',
    status: 'published',
  },
  {
    id: 4,
    name: 'Shakespeare Analysis Video',
    type: 'video',
    size: '78.9 MB',
    duration: '22:15',
    format: 'MP4',
    uploadedBy: 'David Brown',
    uploadedAt: '2024-01-12',
    subject: 'English',
    level: 'O-Level',
    views: 0,
    thumbnail: '/video-thumb-2.jpg',
    status: 'draft',
  },
  {
    id: 5,
    name: 'Biology Cell Structure',
    type: 'image',
    size: '3.4 MB',
    dimensions: '2048x1536',
    format: 'JPG',
    uploadedBy: 'Emma Wilson',
    uploadedAt: '2024-01-11',
    subject: 'Biology',
    level: 'O-Level',
    views: 1200,
    thumbnail: '/image-thumb-2.jpg',
    status: 'published',
  },
  {
    id: 6,
    name: 'History Timeline Document',
    type: 'pdf',
    size: '12.3 MB',
    pages: 36,
    format: 'PDF',
    uploadedBy: 'John Smith',
    uploadedAt: '2024-01-10',
    subject: 'History',
    level: 'A-Level',
    views: 780,
    thumbnail: '/pdf-thumb-2.jpg',
    status: 'review',
  },
];

const typeIcons = {
  video: Play,
  image: Image,
  pdf: FileText,
};

const typeColors = {
  video: 'bg-blue-100 text-blue-800',
  image: 'bg-green-100 text-green-800',
  pdf: 'bg-purple-100 text-purple-800',
};

const statusColors = {
  published: 'bg-success/10 text-success',
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-warning/10 text-warning',
  archived: 'bg-destructive/10 text-destructive',
};

export default function MediaLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mediaItems, setMediaItems] = useState(initialMediaItems);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalSize = mediaItems.reduce((acc, item) => {
    const size = parseFloat(item.size.split(' ')[0]);
    return acc + size;
  }, 0);

  const handleMediaUploaded = (newMedia: any) => {
    setMediaItems(prev => [newMedia, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-2">Manage all media assets including videos, images, and documents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Bulk Download</span>
          </Button>
          <UploadMediaDialog
            trigger={
              <Button className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Media</span>
              </Button>
            }
            onMediaUploaded={handleMediaUploaded}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{mediaItems.length}</div>
            <div className="text-sm text-gray-600">Total Files</div>
            <div className="text-xs text-success mt-1">+12 this week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} MB</div>
            <div className="text-sm text-gray-600">Storage Used</div>
            <div className="text-xs text-gray-500 mt-1">2.1 GB available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{mediaItems.filter(item => item.type === 'video').length}</div>
            <div className="text-sm text-gray-600">Videos</div>
            <div className="text-xs text-blue-600 mt-1">Most popular type</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{mediaItems.reduce((acc, item) => acc + item.views, 0).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Views</div>
            <div className="text-xs text-success mt-1">+15.3% this month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Media Files</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
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
                placeholder="Search media files..."
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
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
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

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const TypeIcon = typeIcons[item.type as keyof typeof typeIcons];
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <TypeIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm text-gray-900 truncate flex-1">
                          {item.name}
                        </h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={typeColors[item.type as keyof typeof typeColors]}>
                            {item.type}
                          </Badge>
                          <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div>{item.size} • {item.format}</div>
                          {item.type === 'video' && <div>{item.duration}</div>}
                          {item.type === 'image' && <div>{item.dimensions}</div>}
                          {item.type === 'pdf' && <div>{item.pages} pages</div>}
                        </div>
                        <div className="text-xs text-gray-500">
                          <div>{item.views.toLocaleString()} views</div>
                          <div>by {item.uploadedBy}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => {
                const TypeIcon = typeIcons[item.type as keyof typeof typeIcons];
                return (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <TypeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={typeColors[item.type as keyof typeof typeColors]}>
                            {item.type}
                          </Badge>
                          <Badge className={statusColors[item.status as keyof typeof statusColors]}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-gray-500">
                          {item.size} • {item.format} • {item.subject} ({item.level})
                          {item.type === 'video' && ` • ${item.duration}`}
                          {item.type === 'image' && ` • ${item.dimensions}`}
                          {item.type === 'pdf' && ` • ${item.pages} pages`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.views.toLocaleString()} views • by {item.uploadedBy}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}