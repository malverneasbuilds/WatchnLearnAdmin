'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, X } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  level: string;
  examBoard: string;
  terms: Term[];
}

interface Term {
  id: number;
  title: string;
  order: number;
  weeks: Week[];
}

interface Week {
  id: number;
  title: string;
  order: number;
  chapters: Chapter[];
}

interface Chapter {
  id: number;
  title: string;
  order: number;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  type: string;
  order: number;
}

interface AddContentDialogProps {
  trigger: React.ReactNode;
  onContentAdded: (content: any) => void;
  subjects: Subject[];
}

export function AddContentDialog({ trigger, onContentAdded, subjects }: AddContentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    termId: '',
    weekNumber: '',
    chapterId: '',
    newChapterTitle: '',
    position: 1,
    title: '',
    type: '',
    estimatedDuration: '',
    tags: [] as string[],
    file: null as File | null,
  });
  const [currentTag, setCurrentTag] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isNewChapter, setIsNewChapter] = useState(false);

  const contentTypes = ['video', 'pdf', 'quiz', 'notes'];

  // Generate week options (Week 1 to Week 13)
  const weekOptions = Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`);

  // Reset dependent selections when parent changes
  useEffect(() => {
    if (formData.subjectId) {
      const subject = subjects.find(s => s.id.toString() === formData.subjectId);
      setSelectedSubject(subject || null);
      setFormData(prev => ({ ...prev, termId: '', weekNumber: '', chapterId: '', position: 1 }));
      setSelectedTerm(null);
      setSelectedWeek(null);
      setSelectedChapter(null);
    }
  }, [formData.subjectId, subjects]);

  useEffect(() => {
    if (formData.termId && selectedSubject) {
      const term = selectedSubject.terms.find(t => t.id.toString() === formData.termId);
      setSelectedTerm(term || null);
      setFormData(prev => ({ ...prev, weekNumber: '', chapterId: '', position: 1 }));
      setSelectedWeek(null);
      setSelectedChapter(null);
    }
  }, [formData.termId, selectedSubject]);

  useEffect(() => {
    if (formData.weekNumber && selectedTerm) {
      const week = selectedTerm.weeks.find(w => w.title === formData.weekNumber);
      setSelectedWeek(week || null);
      setFormData(prev => ({ ...prev, chapterId: '', position: 1 }));
      setSelectedChapter(null);
    }
  }, [formData.weekNumber, selectedTerm]);

  useEffect(() => {
    if (formData.chapterId && selectedWeek) {
      const chapter = selectedWeek.chapters.find(c => c.id.toString() === formData.chapterId);
      setSelectedChapter(chapter || null);
      // Set default position to be after the last topic
      if (chapter) {
        setFormData(prev => ({ ...prev, position: chapter.topics.length + 1 }));
      }
    }
  }, [formData.chapterId, selectedWeek]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContent = {
      id: Date.now(),
      ...formData,
      subject: selectedSubject?.name,
      level: selectedSubject?.level,
      examBoard: selectedSubject?.examBoard,
      term: selectedTerm?.title,
      week: formData.weekNumber,
      chapter: isNewChapter ? formData.newChapterTitle : selectedChapter?.title,
      createdAt: new Date().toISOString(),
      status: 'draft',
      views: 0,
    };

    onContentAdded(newContent);
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      subjectId: '',
      termId: '',
      weekNumber: '',
      chapterId: '',
      newChapterTitle: '',
      position: 1,
      title: '',
      type: '',
      estimatedDuration: '',
      tags: [],
      file: null,
    });
    setCurrentTag('');
    setSelectedSubject(null);
    setSelectedTerm(null);
    setSelectedWeek(null);
    setSelectedChapter(null);
    setIsNewChapter(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={formData.subjectId} onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name} ({subject.level} - {subject.examBoard})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSubject && (
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{selectedSubject.level}</Badge>
                <Badge variant="outline">{selectedSubject.examBoard}</Badge>
              </div>
            )}
          </div>

          {/* Term Selection */}
          {selectedSubject && (
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={formData.termId} onValueChange={(value) => setFormData(prev => ({ ...prev, termId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSubject.terms.map(term => (
                    <SelectItem key={term.id} value={term.id.toString()}>
                      {term.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Week Selection */}
          {selectedTerm && (
            <div className="space-y-2">
              <Label htmlFor="week">Week</Label>
              <Select value={formData.weekNumber} onValueChange={(value) => setFormData(prev => ({ ...prev, weekNumber: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {weekOptions.map(week => (
                    <SelectItem key={week} value={week}>
                      {week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Chapter Selection */}
          {formData.weekNumber && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Chapter</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="existing-chapter"
                      name="chapter-type"
                      checked={!isNewChapter}
                      onChange={() => setIsNewChapter(false)}
                    />
                    <Label htmlFor="existing-chapter">Use existing chapter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="new-chapter"
                      name="chapter-type"
                      checked={isNewChapter}
                      onChange={() => setIsNewChapter(true)}
                    />
                    <Label htmlFor="new-chapter">Create new chapter</Label>
                  </div>
                </div>
              </div>

              {!isNewChapter ? (
                selectedWeek && selectedWeek.chapters.length > 0 ? (
                  <div className="space-y-2">
                    <Select value={formData.chapterId} onValueChange={(value) => setFormData(prev => ({ ...prev, chapterId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedWeek.chapters.map(chapter => (
                          <SelectItem key={chapter.id} value={chapter.id.toString()}>
                            {chapter.title} ({chapter.topics.length} topics)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                    No existing chapters for {formData.weekNumber}. Please create a new chapter.
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <Input
                    value={formData.newChapterTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, newChapterTitle: e.target.value }))}
                    placeholder="Enter new chapter title"
                    required={isNewChapter}
                  />
                </div>
              )}
            </div>
          )}

          {/* Position Input */}
          {(selectedChapter || isNewChapter) && (
            <div className="space-y-2">
              <Label htmlFor="position">Position in Chapter</Label>
              <Input
                id="position"
                type="number"
                min="1"
                max={selectedChapter ? selectedChapter.topics.length + 1 : 1}
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                placeholder="Enter position number"
              />
              <p className="text-xs text-gray-500">
                {selectedChapter 
                  ? `Enter a number between 1 and ${selectedChapter.topics.length + 1}. Current topics: ${selectedChapter.topics.length}`
                  : 'This will be the first topic in the new chapter'
                }
              </p>
            </div>
          )}

          {/* Content Title and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Content Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Introduction to Hydrocarbons"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Content Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration</Label>
            <Input
              id="duration"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
              placeholder="e.g., 15 minutes"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                accept=".mp4,.mov,.pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById('file')?.click()}>
                Choose File
              </Button>
              {formData.file && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.file.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}