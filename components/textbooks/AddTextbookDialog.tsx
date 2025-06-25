'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Plus, BookOpen } from 'lucide-react';

interface AddTextbookDialogProps {
  trigger: React.ReactNode;
  onTextbookAdded: (textbook: any) => void;
}

export function AddTextbookDialog({ trigger, onTextbookAdded }: AddTextbookDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    authors: [] as string[],
    publisher: '',
    edition: '',
    year: new Date().getFullYear(),
    isbn: '',
    subject: '',
    level: '',
    examBoard: '',
    description: '',
    coverImage: null as File | null,
  });
  const [currentAuthor, setCurrentAuthor] = useState('');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const levels = ['JC', 'O-Level', 'A-Level'];
  const examBoards = ['ZIMSEC', 'Cambridge'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const addAuthor = () => {
    if (currentAuthor.trim() && !formData.authors.includes(currentAuthor.trim())) {
      setFormData(prev => ({
        ...prev,
        authors: [...prev.authors, currentAuthor.trim()]
      }));
      setCurrentAuthor('');
    }
  };

  const removeAuthor = (authorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter(author => author !== authorToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTextbook = {
      id: Date.now(),
      title: formData.title,
      authors: formData.authors,
      publisher: formData.publisher,
      edition: formData.edition,
      year: formData.year,
      isbn: formData.isbn,
      subject: formData.subject,
      level: formData.level,
      examBoard: formData.examBoard,
      description: formData.description,
      coverImage: formData.coverImage ? URL.createObjectURL(formData.coverImage) : '/textbook-covers/default.jpg',
      addedDate: new Date().toISOString().split('T')[0],
    };

    onTextbookAdded(newTextbook);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      authors: [],
      publisher: '',
      edition: '',
      year: new Date().getFullYear(),
      isbn: '',
      subject: '',
      level: '',
      examBoard: '',
      description: '',
      coverImage: null,
    });
    setCurrentAuthor('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Add New Textbook</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>Book Cover Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload book cover image (JPG, PNG)
              </p>
              <Input
                type="file"
                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.files?.[0] || null }))}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                id="cover-image"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById('cover-image')?.click()}>
                Choose Image
              </Button>
              {formData.coverImage && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.coverImage.name}
                </p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Advanced Mathematics for A-Level"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher *</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                placeholder="e.g., Oxford University Press"
                required
              />
            </div>
          </div>

          {/* Authors Section */}
          <div className="space-y-4">
            <Label>Authors *</Label>
            
            {/* Current Authors */}
            {formData.authors.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Added Authors:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.authors.map((author, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {author}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAuthor(author)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Author */}
            <div className="flex gap-2">
              <Input
                value={currentAuthor}
                onChange={(e) => setCurrentAuthor(e.target.value)}
                placeholder="Enter author name..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
              />
              <Button type="button" onClick={addAuthor} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Edition and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                value={formData.edition}
                onChange={(e) => setFormData(prev => ({ ...prev, edition: e.target.value }))}
                placeholder="e.g., 3rd Edition"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Publication Year *</Label>
              <Select value={formData.year.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject Association */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examBoard">Exam Board *</Label>
              <Select value={formData.examBoard} onValueChange={(value) => setFormData(prev => ({ ...prev, examBoard: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {examBoards.map(board => (
                    <SelectItem key={board} value={board}>{board}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ISBN */}
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
              placeholder="e.g., 978-0-19-123456-7"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the textbook content and features..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.title || !formData.publisher || formData.authors.length === 0 || !formData.subject || !formData.level || !formData.examBoard}
            >
              Add Textbook
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}