'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Plus, FileText, Trash2 } from 'lucide-react';

interface Paper {
  id: number;
  name: string;
  topics: string[];
}

interface AddSyllabusDialogProps {
  trigger: React.ReactNode;
  onSyllabusAdded: (syllabus: any) => void;
}

export function AddSyllabusDialog({ trigger, onSyllabusAdded }: AddSyllabusDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    level: '',
    examBoard: '',
    year: new Date().getFullYear(),
    overview: '',
    totalTopics: 0,
    syllabusFile: null as File | null,
    assessmentFile: null as File | null,
    specimenFile: null as File | null,
  });
  const [papers, setPapers] = useState<Paper[]>([]);
  const [currentPaper, setCurrentPaper] = useState({
    name: '',
    topics: [] as string[],
  });
  const [currentTopic, setCurrentTopic] = useState('');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const levels = ['JC', 'O-Level', 'A-Level'];
  const examBoards = ['ZIMSEC', 'Cambridge'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const addTopicToPaper = () => {
    if (currentTopic.trim() && !currentPaper.topics.includes(currentTopic.trim())) {
      setCurrentPaper(prev => ({
        ...prev,
        topics: [...prev.topics, currentTopic.trim()]
      }));
      setCurrentTopic('');
    }
  };

  const removeTopicFromPaper = (topicToRemove: string) => {
    setCurrentPaper(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }));
  };

  const addPaper = () => {
    if (currentPaper.name.trim() && currentPaper.topics.length > 0) {
      const newPaper: Paper = {
        id: Date.now(),
        name: currentPaper.name.trim(),
        topics: [...currentPaper.topics],
      };
      setPapers(prev => [...prev, newPaper]);
      setCurrentPaper({ name: '', topics: [] });
    }
  };

  const removePaper = (paperId: number) => {
    setPapers(prev => prev.filter(paper => paper.id !== paperId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalTopicsCount = papers.reduce((acc, paper) => acc + paper.topics.length, 0);
    
    const newSyllabus = {
      id: Date.now(),
      subject: formData.subject,
      level: formData.level,
      examBoard: formData.examBoard,
      year: formData.year,
      overview: formData.overview,
      totalTopics: totalTopicsCount,
      papers: papers,
      syllabusFile: formData.syllabusFile?.name || '',
      assessmentFile: formData.assessmentFile?.name || '',
      specimenFile: formData.specimenFile?.name || '',
      addedDate: new Date().toISOString().split('T')[0],
    };

    onSyllabusAdded(newSyllabus);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      level: '',
      examBoard: '',
      year: new Date().getFullYear(),
      overview: '',
      totalTopics: 0,
      syllabusFile: null,
      assessmentFile: null,
      specimenFile: null,
    });
    setPapers([]);
    setCurrentPaper({ name: '', topics: [] });
    setCurrentTopic('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Add New Syllabus</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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

          <div className="space-y-2">
            <Label htmlFor="year">Syllabus Year *</Label>
            <Select value={formData.year.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview">Syllabus Overview *</Label>
            <Textarea
              id="overview"
              value={formData.overview}
              onChange={(e) => setFormData(prev => ({ ...prev, overview: e.target.value }))}
              placeholder="Brief overview of the syllabus content and objectives..."
              rows={4}
              required
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Syllabus PDF *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-600 mb-2">Upload syllabus document</p>
                <Input
                  type="file"
                  onChange={(e) => setFormData(prev => ({ ...prev, syllabusFile: e.target.files?.[0] || null }))}
                  accept=".pdf"
                  className="hidden"
                  id="syllabus-file"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('syllabus-file')?.click()}>
                  Choose PDF
                </Button>
                {formData.syllabusFile && (
                  <p className="text-xs text-gray-600 mt-1">{formData.syllabusFile.name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assessment Objectives</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-600 mb-2">Upload assessment document</p>
                <Input
                  type="file"
                  onChange={(e) => setFormData(prev => ({ ...prev, assessmentFile: e.target.files?.[0] || null }))}
                  accept=".pdf"
                  className="hidden"
                  id="assessment-file"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('assessment-file')?.click()}>
                  Choose PDF
                </Button>
                {formData.assessmentFile && (
                  <p className="text-xs text-gray-600 mt-1">{formData.assessmentFile.name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specimen Papers</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-600 mb-2">Upload specimen papers</p>
                <Input
                  type="file"
                  onChange={(e) => setFormData(prev => ({ ...prev, specimenFile: e.target.files?.[0] || null }))}
                  accept=".pdf"
                  className="hidden"
                  id="specimen-file"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('specimen-file')?.click()}>
                  Choose PDF
                </Button>
                {formData.specimenFile && (
                  <p className="text-xs text-gray-600 mt-1">{formData.specimenFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Papers and Topics Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Paper Topics Breakdown</Label>
            
            {/* Existing Papers */}
            {papers.length > 0 && (
              <div className="space-y-3">
                {papers.map((paper) => (
                  <Card key={paper.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{paper.name}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePaper(paper.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {paper.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{paper.topics.length} topics</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add New Paper */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-sm">Add New Paper</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paperName">Paper Name *</Label>
                  <Input
                    id="paperName"
                    value={currentPaper.name}
                    onChange={(e) => setCurrentPaper(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Paper 1, Paper 2"
                  />
                </div>

                {/* Current Paper Topics */}
                {currentPaper.topics.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Topics for {currentPaper.name || 'this paper'}:</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentPaper.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {topic}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTopicFromPaper(topic)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Topic */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Add Topic</Label>
                  <div className="flex gap-2">
                    <Input
                      id="topic"
                      value={currentTopic}
                      onChange={(e) => setCurrentTopic(e.target.value)}
                      placeholder="Enter topic name..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopicToPaper())}
                    />
                    <Button type="button" onClick={addTopicToPaper} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  type="button" 
                  onClick={addPaper} 
                  className="w-full"
                  disabled={!currentPaper.name.trim() || currentPaper.topics.length === 0}
                >
                  Add Paper
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.subject || !formData.level || !formData.examBoard || !formData.overview || !formData.syllabusFile || papers.length === 0}
            >
              Add Syllabus
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}