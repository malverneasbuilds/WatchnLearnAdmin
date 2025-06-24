'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Plus, X } from 'lucide-react';

interface Teacher {
  name: string;
  email: string;
  phone: string;
  qualification: string;
}

interface AddSubjectDialogProps {
  trigger: React.ReactNode;
  onSubjectAdded: (subject: any) => void;
}

export function AddSubjectDialog({ trigger, onSubjectAdded }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: '',
    examBoards: [] as string[],
    icon: 'BookOpen',
    teachers: [] as Teacher[],
  });
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>({
    name: '',
    email: '',
    phone: '',
    qualification: '',
  });

  const levels = ['JC', 'O-Level', 'A-Level'];
  const examBoards = ['ZIMSEC', 'Cambridge'];

  const handleExamBoardChange = (board: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      examBoards: checked 
        ? [...prev.examBoards, board]
        : prev.examBoards.filter(b => b !== board)
    }));
  };

  const addTeacher = () => {
    if (currentTeacher.name.trim() && currentTeacher.email.trim()) {
      setFormData(prev => ({
        ...prev,
        teachers: [...prev.teachers, currentTeacher]
      }));
      setCurrentTeacher({
        name: '',
        email: '',
        phone: '',
        qualification: '',
      });
    }
  };

  const removeTeacher = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teachers: prev.teachers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create subjects for each selected exam board
    formData.examBoards.forEach(examBoard => {
      const newSubject = {
        id: Date.now() + Math.random(), // Ensure unique IDs for multiple boards
        name: formData.name,
        description: formData.description,
        level: formData.level,
        examBoard: examBoard,
        teachers: formData.teachers,
        enrolledStudents: 0,
        contentItems: 0,
        completionRate: 0,
        status: 'active',
        lastUpdated: new Date().toISOString(),
        terms: [
          { 
            id: 1, 
            title: 'Term 1', 
            order: 1, 
            weeks: Array.from({ length: 13 }, (_, i) => ({
              id: i + 1,
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
          },
        ],
      };

      onSubjectAdded(newSubject);
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      level: '',
      examBoards: [],
      icon: 'BookOpen',
      teachers: [],
    });
    setCurrentTeacher({
      name: '',
      email: '',
      phone: '',
      qualification: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Advanced Mathematics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
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
          </div>

          <div className="space-y-2">
            <Label>Exam Boards</Label>
            <p className="text-sm text-gray-600">Select one or both exam boards for this subject</p>
            <div className="space-y-2">
              {examBoards.map(board => (
                <div key={board} className="flex items-center space-x-2">
                  <Checkbox
                    id={board}
                    checked={formData.examBoards.includes(board)}
                    onCheckedChange={(checked) => handleExamBoardChange(board, checked as boolean)}
                  />
                  <Label htmlFor={board}>{board}</Label>
                </div>
              ))}
            </div>
            {formData.examBoards.length > 0 && (
              <div className="flex gap-2 mt-2">
                {formData.examBoards.map(board => (
                  <Badge key={board} variant="outline">{board}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the subject..."
              rows={3}
            />
          </div>

          {/* Teacher Information Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Subject Teachers</Label>
            
            {/* Current Teachers */}
            {formData.teachers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Added Teachers:</Label>
                <div className="space-y-2">
                  {formData.teachers.map((teacher, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-gray-600">{teacher.email}</div>
                        <div className="text-sm text-gray-500">{teacher.phone}</div>
                        <div className="text-sm text-gray-500">{teacher.qualification}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeacher(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Teacher */}
            <div className="border rounded-lg p-4 space-y-4">
              <Label className="text-sm font-medium">Add Teacher</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">Full Name *</Label>
                  <Input
                    id="teacherName"
                    value={currentTeacher.name}
                    onChange={(e) => setCurrentTeacher(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Teacher's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherEmail">Email *</Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    value={currentTeacher.email}
                    onChange={(e) => setCurrentTeacher(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="teacher@school.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherPhone">Phone Number</Label>
                  <Input
                    id="teacherPhone"
                    value={currentTeacher.phone}
                    onChange={(e) => setCurrentTeacher(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+263 xxx xxx xxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherQualification">Qualification</Label>
                  <Input
                    id="teacherQualification"
                    value={currentTeacher.qualification}
                    onChange={(e) => setCurrentTeacher(prev => ({ ...prev, qualification: e.target.value }))}
                    placeholder="e.g., BSc Mathematics, MSc Education"
                  />
                </div>
              </div>
              <Button 
                type="button" 
                onClick={addTeacher} 
                size="sm" 
                className="w-full"
                disabled={!currentTeacher.name.trim() || !currentTeacher.email.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name || !formData.level || formData.examBoards.length === 0}
            >
              Add Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}