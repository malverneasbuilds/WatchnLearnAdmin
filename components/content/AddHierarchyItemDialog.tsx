'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddHierarchyItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'week' | 'chapter' | 'topic';
  onAdd: (data: any) => void;
}

export function AddHierarchyItemDialog({ open, onOpenChange, type, onAdd }: AddHierarchyItemDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    duration: '',
    estimatedTime: '',
  });

  const topicTypes = ['video', 'pdf', 'quiz', 'notes'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      title: '',
      description: '',
      type: 'video',
      duration: '',
      estimatedTime: '',
    });
    onOpenChange(false);
  };

  const getTitle = () => {
    switch (type) {
      case 'week': return 'Add New Week';
      case 'chapter': return 'Add New Chapter';
      case 'topic': return 'Add New Topic';
      default: return 'Add Item';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'week': return 'e.g., Week 14';
      case 'chapter': return 'e.g., Introduction to Organic Chemistry';
      case 'topic': return 'e.g., Hydrocarbons and their Properties';
      default: return 'Enter title';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={getPlaceholder()}
              required
            />
          </div>

          {type === 'chapter' && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the chapter content..."
                rows={3}
              />
            </div>
          )}

          {type === 'topic' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="type">Content Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {topicTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration/Length</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 15 minutes, 24 pages, 20 questions"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Study Time</Label>
                <Input
                  id="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="e.g., 30 minutes"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}