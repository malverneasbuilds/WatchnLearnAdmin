'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Video,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Copy,
  MoreHorizontal,
} from 'lucide-react';
import { AddHierarchyItemDialog } from './AddHierarchyItemDialog';

interface Topic {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz' | 'notes';
  duration?: string;
  order: number;
  status: 'published' | 'draft' | 'review';
  estimatedTime?: string;
}

interface Chapter {
  id: number;
  title: string;
  description?: string;
  order: number;
  topics: Topic[];
  isExpanded?: boolean;
  isContinuation?: boolean;
  originalChapterId?: number;
}

interface Week {
  id: number;
  title: string;
  order: number;
  chapters: Chapter[];
  isExpanded?: boolean;
}

interface Term {
  id: number;
  title: string;
  order: number;
  weeks: Week[];
  isExpanded?: boolean;
}

interface Subject {
  id: number;
  name: string;
  level: string;
  examBoard: string;
  school?: string;
  terms: Term[];
  isExpanded?: boolean;
}

interface ContentHierarchyProps {
  subjects: Subject[];
}

const typeIcons = {
  video: Video,
  pdf: FileText,
  quiz: HelpCircle,
  notes: BookOpen,
};

const statusColors = {
  published: 'bg-success/10 text-success',
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-warning/10 text-warning',
};

const levels = ['JC', 'O-Level', 'A-Level'];
const examBoards = ['ZIMSEC', 'Cambridge'];
const topicTypes = ['video', 'pdf', 'quiz', 'notes'];

export function ContentHierarchy({ subjects: initialSubjects }: ContentHierarchyProps) {
  const [subjects, setSubjects] = useState<Subject[]>(
    initialSubjects.map(subject => ({ ...subject, isExpanded: true }))
  );
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [editExamBoard, setEditExamBoard] = useState('');
  const [editTopicType, setEditTopicType] = useState('');
  
  // Modal states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addDialogType, setAddDialogType] = useState<'week' | 'chapter' | 'topic'>('week');
  const [addDialogContext, setAddDialogContext] = useState<{
    subjectId: number;
    termId?: number;
    weekId?: number;
    chapterId?: number;
  }>({ subjectId: 0 });

  const toggleExpanded = (type: string, id: string | number, parentIds?: (string | number)[]) => {
    setSubjects(prev => prev.map(subject => {
      if (type === 'subject' && subject.id === id) {
        return { ...subject, isExpanded: !subject.isExpanded };
      }
      
      if (parentIds && parentIds[0] === subject.id) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (type === 'term' && term.id === id) {
              return { ...term, isExpanded: !term.isExpanded };
            }
            
            if (parentIds[1] === term.id) {
              return {
                ...term,
                weeks: term.weeks.map(week => {
                  if (type === 'week' && week.id === id) {
                    return { ...week, isExpanded: !week.isExpanded };
                  }
                  
                  if (parentIds[2] === week.id) {
                    return {
                      ...week,
                      chapters: week.chapters.map(chapter => {
                        if (type === 'chapter' && chapter.id === id) {
                          return { ...chapter, isExpanded: !chapter.isExpanded };
                        }
                        return chapter;
                      }),
                    };
                  }
                  return week;
                }),
              };
            }
            return term;
          }),
        };
      }
      return subject;
    }));
  };

  const openAddDialog = (type: 'week' | 'chapter' | 'topic', context: any) => {
    setAddDialogType(type);
    setAddDialogContext(context);
    setAddDialogOpen(true);
  };

  const handleAddItem = (data: any) => {
    const { subjectId, termId, weekId, chapterId } = addDialogContext;

    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (addDialogType === 'week' && term.id === termId) {
              const newWeek: Week = {
                id: Date.now(),
                title: data.title,
                order: term.weeks.length + 1,
                chapters: [],
                isExpanded: true,
              };
              return {
                ...term,
                weeks: [...term.weeks, newWeek],
              };
            }

            if (term.id === termId) {
              return {
                ...term,
                weeks: term.weeks.map(week => {
                  if (addDialogType === 'chapter' && week.id === weekId) {
                    const newChapter: Chapter = {
                      id: Date.now(),
                      title: data.title,
                      description: data.description,
                      order: week.chapters.length + 1,
                      topics: [],
                      isExpanded: true,
                    };
                    return {
                      ...week,
                      chapters: [...week.chapters, newChapter],
                    };
                  }

                  if (week.id === weekId) {
                    return {
                      ...week,
                      chapters: week.chapters.map(chapter => {
                        if (addDialogType === 'topic' && chapter.id === chapterId) {
                          const newTopic: Topic = {
                            id: Date.now().toString(),
                            title: data.title,
                            type: data.type,
                            duration: data.duration,
                            estimatedTime: data.estimatedTime,
                            order: chapter.topics.length + 1,
                            status: 'published',
                          };
                          return {
                            ...chapter,
                            topics: [...chapter.topics, newTopic],
                          };
                        }
                        return chapter;
                      }),
                    };
                  }
                  return week;
                }),
              };
            }
            return term;
          }),
        };
      }
      return subject;
    }));
  };

  const continueChapterToNextWeek = (subjectId: number, termId: number, weekId: number, chapterId: number) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (term.id === termId) {
              const currentWeekIndex = term.weeks.findIndex(w => w.id === weekId);
              const nextWeek = term.weeks[currentWeekIndex + 1];
              
              if (nextWeek) {
                const originalChapter = term.weeks[currentWeekIndex].chapters.find(c => c.id === chapterId);
                
                if (originalChapter) {
                  const continuationChapter: Chapter = {
                    ...originalChapter,
                    id: Date.now(),
                    isContinuation: true,
                    originalChapterId: originalChapter.id,
                    order: nextWeek.chapters.length + 1,
                    topics: [],
                  };

                  return {
                    ...term,
                    weeks: term.weeks.map(week => {
                      if (week.id === nextWeek.id) {
                        return {
                          ...week,
                          chapters: [...week.chapters, continuationChapter],
                        };
                      }
                      return week;
                    }),
                  };
                }
              }
            }
            return term;
          }),
        };
      }
      return subject;
    }));
  };

  const moveTopicUp = (subjectId: number, termId: number, weekId: number, chapterId: number, topicId: string) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (term.id === termId) {
              return {
                ...term,
                weeks: term.weeks.map(week => {
                  if (week.id === weekId) {
                    return {
                      ...week,
                      chapters: week.chapters.map(chapter => {
                        if (chapter.id === chapterId) {
                          const topics = [...chapter.topics];
                          const topicIndex = topics.findIndex(t => t.id === topicId);
                          if (topicIndex > 0) {
                            [topics[topicIndex - 1], topics[topicIndex]] = [topics[topicIndex], topics[topicIndex - 1]];
                            topics[topicIndex - 1].order = topicIndex;
                            topics[topicIndex].order = topicIndex + 1;
                          }
                          return { ...chapter, topics };
                        }
                        return chapter;
                      }),
                    };
                  }
                  return week;
                }),
              };
            }
            return term;
          }),
        };
      }
      return subject;
    }));
  };

  const moveTopicDown = (subjectId: number, termId: number, weekId: number, chapterId: number, topicId: string) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (term.id === termId) {
              return {
                ...term,
                weeks: term.weeks.map(week => {
                  if (week.id === weekId) {
                    return {
                      ...week,
                      chapters: week.chapters.map(chapter => {
                        if (chapter.id === chapterId) {
                          const topics = [...chapter.topics];
                          const topicIndex = topics.findIndex(t => t.id === topicId);
                          if (topicIndex < topics.length - 1) {
                            [topics[topicIndex], topics[topicIndex + 1]] = [topics[topicIndex + 1], topics[topicIndex]];
                            topics[topicIndex].order = topicIndex + 1;
                            topics[topicIndex + 1].order = topicIndex + 2;
                          }
                          return { ...chapter, topics };
                        }
                        return chapter;
                      }),
                    };
                  }
                  return week;
                }),
              };
            }
            return term;
          }),
        };
      }
      return subject;
    }));
  };

  const startEditing = (id: string, currentValue: string, level?: string, examBoard?: string, topicType?: string) => {
    setEditingItem(id);
    setEditValue(currentValue);
    setEditLevel(level || '');
    setEditExamBoard(examBoard || '');
    setEditTopicType(topicType || '');
  };

  const saveEdit = () => {
    if (!editingItem) return;

    setSubjects(prev => prev.map(subject => {
      // Edit subject
      if (editingItem === `subject-${subject.id}`) {
        return {
          ...subject,
          name: editValue,
          level: editLevel,
          examBoard: editExamBoard,
        };
      }

      // Edit terms, weeks, chapters, topics
      return {
        ...subject,
        terms: subject.terms.map(term => {
          if (editingItem === `term-${term.id}`) {
            return { ...term, title: editValue };
          }

          return {
            ...term,
            weeks: term.weeks.map(week => {
              if (editingItem === `week-${week.id}`) {
                return { ...week, title: editValue };
              }

              return {
                ...week,
                chapters: week.chapters.map(chapter => {
                  if (editingItem === `chapter-${chapter.id}`) {
                    return { ...chapter, title: editValue };
                  }

                  return {
                    ...chapter,
                    topics: chapter.topics.map(topic => {
                      if (editingItem === `topic-${topic.id}`) {
                        return {
                          ...topic,
                          title: editValue,
                          type: editTopicType as any,
                        };
                      }
                      return topic;
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    }));

    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
    setEditLevel('');
    setEditExamBoard('');
    setEditTopicType('');
  };

  const deleteItem = (type: string, id: string | number, parentIds?: (string | number)[]) => {
    setSubjects(prev => prev.map(subject => {
      if (type === 'week' && parentIds) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (term.id === parentIds[1]) {
              return {
                ...term,
                weeks: term.weeks.filter(week => week.id !== id),
              };
            }
            return term;
          }),
        };
      }

      if (type === 'chapter' && parentIds) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (term.id === parentIds[1]) {
              return {
                ...term,
                weeks: term.weeks.map(week => {
                  if (week.id === parentIds[2]) {
                    return {
                      ...week,
                      chapters: week.chapters.filter(chapter => chapter.id !== id),
                    };
                  }
                  return week;
                }),
              };
            }
            return term;
          }),
        };
      }

      if (type === 'topic' && parentIds) {
        return {
          ...subject,
          terms: subject.terms.map(term => {
            if (term.id === parentIds[1]) {
              return {
                ...term,
                weeks: term.weeks.map(week => {
                  if (week.id === parentIds[2]) {
                    return {
                      ...week,
                      chapters: week.chapters.map(chapter => {
                        if (chapter.id === parentIds[3]) {
                          return {
                            ...chapter,
                            topics: chapter.topics.filter(topic => topic.id !== id),
                          };
                        }
                        return chapter;
                      }),
                    };
                  }
                  return week;
                }),
              };
            }
            return term;
          }),
        };
      }

      return subject;
    }));
  };

  const renderTopic = (
    topic: Topic, 
    subjectId: number, 
    termId: number, 
    weekId: number, 
    chapterId: number,
    topicIndex: number,
    totalTopics: number
  ) => {
    const TypeIcon = typeIcons[topic.type];
    const isEditing = editingItem === `topic-${topic.id}`;
    
    return (
      <div
        key={topic.id}
        className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 group"
      >
        <div className="flex items-center space-x-3">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveTopicUp(subjectId, termId, weekId, chapterId, topic.id)}
              disabled={topicIndex === 0}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => moveTopicDown(subjectId, termId, weekId, chapterId, topic.id)}
              disabled={topicIndex === totalTopics - 1}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
          <div className="text-sm font-medium text-gray-500 min-w-[2rem]">
            {topic.order}
          </div>
          <TypeIcon className="h-4 w-4 text-gray-500" />
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                />
                <Select value={editTopicType} onValueChange={setEditTopicType}>
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {topicTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={saveEdit}>
                  <Check className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div>
                <span className="text-sm font-medium">{topic.title}</span>
                {(topic.duration || topic.estimatedTime) && (
                  <div className="text-xs text-gray-500">
                    {topic.duration && <span>{topic.duration}</span>}
                    {topic.duration && topic.estimatedTime && <span> • </span>}
                    {topic.estimatedTime && <span>Study time: {topic.estimatedTime}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={statusColors[topic.status]}>
            {topic.status}
          </Badge>
          <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditing(`topic-${topic.id}`, topic.title, '', '', topic.type)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => deleteItem('topic', topic.id, [subjectId, termId, weekId, chapterId])}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderChapter = (
    chapter: Chapter, 
    subjectId: number, 
    termId: number, 
    weekId: number
  ) => {
    const isEditing = editingItem === `chapter-${chapter.id}`;

    return (
      <div key={chapter.id} className="border rounded-lg bg-gray-50">
        <Collapsible open={chapter.isExpanded}>
          <CollapsibleTrigger
            className="flex items-center justify-between w-full p-3 hover:bg-gray-100 rounded-t-lg"
            onClick={() => toggleExpanded('chapter', chapter.id, [subjectId, termId, weekId])}
          >
            <div className="flex items-center space-x-2">
              {chapter.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <BookOpen className="h-4 w-4 text-blue-600" />
              {isEditing ? (
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-6 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={saveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{chapter.title}</span>
                  {chapter.isContinuation && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      Continued
                    </Badge>
                  )}
                </div>
              )}
              <Badge variant="outline">{chapter.topics.length} topics</Badge>
            </div>
            <div className="flex items-center space-x-1">
              {!isEditing && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => startEditing(`chapter-${chapter.id}`, chapter.title)}>
                        <Edit className="mr-2 h-3 w-3" />
                        Edit Chapter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => continueChapterToNextWeek(subjectId, termId, weekId, chapter.id)}>
                        <Copy className="mr-2 h-3 w-3" />
                        Continue to Next Week
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteItem('chapter', chapter.id, [subjectId, termId, weekId])}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete Chapter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddDialog('topic', { subjectId, termId, weekId, chapterId: chapter.id });
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3">
            <div className="space-y-2 ml-6">
              {chapter.topics
                .sort((a, b) => a.order - b.order)
                .map((topic, index) => renderTopic(topic, subjectId, termId, weekId, chapter.id, index, chapter.topics.length))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderWeek = (week: Week, subjectId: number, termId: number) => {
    const isEditing = editingItem === `week-${week.id}`;

    return (
      <div key={week.id} className="border rounded-lg bg-blue-50">
        <Collapsible open={week.isExpanded}>
          <CollapsibleTrigger
            className="flex items-center justify-between w-full p-3 hover:bg-blue-100 rounded-t-lg"
            onClick={() => toggleExpanded('week', week.id, [subjectId, termId])}
          >
            <div className="flex items-center space-x-2">
              {week.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Clock className="h-4 w-4 text-blue-600" />
              {isEditing ? (
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-6 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={saveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <span className="font-medium">{week.title}</span>
              )}
              <Badge variant="outline">{week.chapters.length} chapters</Badge>
            </div>
            <div className="flex items-center space-x-1">
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(`week-${week.id}`, week.title);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem('week', week.id, [subjectId, termId]);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddDialog('chapter', { subjectId, termId, weekId: week.id });
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3">
            <div className="space-y-2 ml-6">
              {week.chapters
                .sort((a, b) => a.order - b.order)
                .map(chapter => renderChapter(chapter, subjectId, termId, week.id))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderTerm = (term: Term, subjectId: number) => {
    const isEditing = editingItem === `term-${term.id}`;

    return (
      <div key={term.id} className="border rounded-lg bg-green-50">
        <Collapsible open={term.isExpanded}>
          <CollapsibleTrigger
            className="flex items-center justify-between w-full p-3 hover:bg-green-100 rounded-t-lg"
            onClick={() => toggleExpanded('term', term.id, [subjectId])}
          >
            <div className="flex items-center space-x-2">
              {term.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Calendar className="h-4 w-4 text-green-600" />
              {isEditing ? (
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-6 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={saveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <span className="font-medium">{term.title}</span>
              )}
              <Badge variant="outline">{term.weeks.length} weeks</Badge>
            </div>
            <div className="flex items-center space-x-1">
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(`term-${term.id}`, term.title);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddDialog('week', { subjectId, termId: term.id });
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3">
            <div className="space-y-2 ml-6">
              {term.weeks
                .sort((a, b) => a.order - b.order)
                .map(week => renderWeek(week, subjectId, term.id))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Content Hierarchy</CardTitle>
          <p className="text-sm text-gray-600">
            Organize content by Subject → Term → Week → Chapter → Topics. Click edit buttons to modify items, use plus buttons to add new items, arrow buttons to reorder topics, and "Continue to Next Week" to extend chapters across weeks.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => {
              const isEditing = editingItem === `subject-${subject.id}`;

              return (
                <div key={subject.id} className="border rounded-lg bg-purple-50">
                  <Collapsible open={subject.isExpanded}>
                    <CollapsibleTrigger
                      className="flex items-center justify-between w-full p-4 hover:bg-purple-100 rounded-t-lg"
                      onClick={() => toggleExpanded('subject', subject.id)}
                    >
                      <div className="flex items-center space-x-2">
                        {subject.isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        {isEditing ? (
                          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 text-sm"
                              placeholder="Subject name"
                            />
                            <Select value={editLevel} onValueChange={setEditLevel}>
                              <SelectTrigger className="h-8 w-24">
                                <SelectValue placeholder="Level" />
                              </SelectTrigger>
                              <SelectContent>
                                {levels.map(level => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select value={editExamBoard} onValueChange={setEditExamBoard}>
                              <SelectTrigger className="h-8 w-28">
                                <SelectValue placeholder="Board" />
                              </SelectTrigger>
                              <SelectContent>
                                {examBoards.map(board => (
                                  <SelectItem key={board} value={board}>{board}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm" onClick={saveEdit}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={cancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="font-semibold">{subject.name}</span>
                            <Badge className="bg-purple-100 text-purple-800">{subject.level}</Badge>
                            <Badge variant="outline">{subject.examBoard}</Badge>
                            {subject.school && (
                              <Badge variant="secondary" className="text-xs">{subject.school}</Badge>
                            )}
                          </>
                        )}
                      </div>
                      {!isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(`subject-${subject.id}`, subject.name, subject.level, subject.examBoard);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <div className="space-y-3 ml-6">
                        {subject.terms
                          .sort((a, b) => a.order - b.order)
                          .map(term => renderTerm(term, subject.id))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AddHierarchyItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        type={addDialogType}
        onAdd={handleAddItem}
      />
    </>
  );
}