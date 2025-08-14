import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ChevronDown } from 'lucide-react'

interface HierarchyData {
  exams: Array<{ id: string; name: string }>
  courses: Array<{ id: string; name: string; exam_id: string }>
  subjects: Array<{ id: string; name: string; course_id: string }>
  units: Array<{ id: string; name: string; subject_id: string }>
  chapters: Array<{ id: string; name: string; unit_id: string }>
  topics: Array<{ id: string; name: string; chapter_id: string }>
}

interface SelectedItems {
  exam: { id: string; name: string } | null
  course: { id: string; name: string } | null
  subject: { id: string; name: string } | null
  unit: { id: string; name: string } | null
  chapter: { id: string; name: string } | null
  topic: { id: string; name: string } | null
}

interface HierarchySelectorProps {
  onSelectionChange: (selected: SelectedItems) => void
}

export default function HierarchySelector({ onSelectionChange }: HierarchySelectorProps) {
  const [data, setData] = useState<HierarchyData>({
    exams: [],
    courses: [],
    subjects: [],
    units: [],
    chapters: [],
    topics: []
  })
  
  const [selected, setSelected] = useState<SelectedItems>({
    exam: null,
    course: null,
    subject: null,
    unit: null,
    chapter: null,
    topic: null
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadExams()
  }, [])

  useEffect(() => {
    onSelectionChange(selected)
  }, [selected, onSelectionChange])

  const loadExams = async () => {
    try {
      const { data: exams, error } = await supabase
        .from('exams')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      setData(prev => ({ ...prev, exams: exams || [] }))
    } catch (error) {
      console.error('Error loading exams:', error)
    }
  }

  const loadCourses = async (examId: string) => {
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select('id, name, exam_id')
        .eq('exam_id', examId)
        .order('name')
      
      if (error) throw error
      setData(prev => ({ ...prev, courses: courses || [] }))
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }

  const loadSubjects = async (courseId: string) => {
    try {
      const { data: subjects, error } = await supabase
        .from('subjects')
        .select('id, name, course_id')
        .eq('course_id', courseId)
        .order('name')
      
      if (error) throw error
      setData(prev => ({ ...prev, subjects: subjects || [] }))
    } catch (error) {
      console.error('Error loading subjects:', error)
    }
  }

  const loadUnits = async (subjectId: string) => {
    try {
      const { data: units, error } = await supabase
        .from('units')
        .select('id, name, subject_id')
        .eq('subject_id', subjectId)
        .order('name')
      
      if (error) throw error
      setData(prev => ({ ...prev, units: units || [] }))
    } catch (error) {
      console.error('Error loading units:', error)
    }
  }

  const loadChapters = async (unitId: string) => {
    try {
      const { data: chapters, error } = await supabase
        .from('chapters')
        .select('id, name, unit_id')
        .eq('unit_id', unitId)
        .order('name')
      
      if (error) throw error
      setData(prev => ({ ...prev, chapters: chapters || [] }))
    } catch (error) {
      console.error('Error loading chapters:', error)
    }
  }

  const loadTopics = async (chapterId: string) => {
    try {
      const { data: topics, error } = await supabase
        .from('topics')
        .select('id, name, chapter_id')
        .eq('chapter_id', chapterId)
        .order('name')
      
      if (error) throw error
      setData(prev => ({ ...prev, topics: topics || [] }))
    } catch (error) {
      console.error('Error loading topics:', error)
    }
  }

  const handleExamChange = (examId: string) => {
    const exam = data.exams.find(e => e.id === examId)
    if (exam) {
      setSelected({
        exam,
        course: null,
        subject: null,
        unit: null,
        chapter: null,
        topic: null
      })
      loadCourses(examId)
      setData(prev => ({ ...prev, courses: [], subjects: [], units: [], chapters: [], topics: [] }))
    }
  }

  const handleCourseChange = (courseId: string) => {
    const course = data.courses.find(c => c.id === courseId)
    if (course) {
      setSelected(prev => ({
        ...prev,
        course,
        subject: null,
        unit: null,
        chapter: null,
        topic: null
      }))
      loadSubjects(courseId)
      setData(prev => ({ ...prev, subjects: [], units: [], chapters: [], topics: [] }))
    }
  }

  const handleSubjectChange = (subjectId: string) => {
    const subject = data.subjects.find(s => s.id === subjectId)
    if (subject) {
      setSelected(prev => ({
        ...prev,
        subject,
        unit: null,
        chapter: null,
        topic: null
      }))
      loadUnits(subjectId)
      setData(prev => ({ ...prev, units: [], chapters: [], topics: [] }))
    }
  }

  const handleUnitChange = (unitId: string) => {
    const unit = data.units.find(u => u.id === unitId)
    if (unit) {
      setSelected(prev => ({
        ...prev,
        unit,
        chapter: null,
        topic: null
      }))
      loadChapters(unitId)
      setData(prev => ({ ...prev, chapters: [], topics: [] }))
    }
  }

  const handleChapterChange = (chapterId: string) => {
    const chapter = data.chapters.find(c => c.id === chapterId)
    if (chapter) {
      setSelected(prev => ({
        ...prev,
        chapter,
        topic: null
      }))
      loadTopics(chapterId)
      setData(prev => ({ ...prev, topics: [] }))
    }
  }

  const handleTopicChange = (topicId: string) => {
    const topic = data.topics.find(t => t.id === topicId)
    if (topic) {
      setSelected(prev => ({
        ...prev,
        topic
      }))
    }
  }

  const SelectDropdown = ({ 
    label, 
    options, 
    value, 
    onChange, 
    disabled 
  }: {
    label: string
    options: Array<{ id: string; name: string }>
    value: string
    onChange: (value: string) => void
    disabled?: boolean
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || options.length === 0}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Hierarchy</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectDropdown
          label="Exam"
          options={data.exams}
          value={selected.exam?.id || ''}
          onChange={handleExamChange}
        />
        
        <SelectDropdown
          label="Course"
          options={data.courses}
          value={selected.course?.id || ''}
          onChange={handleCourseChange}
          disabled={!selected.exam}
        />
        
        <SelectDropdown
          label="Subject"
          options={data.subjects}
          value={selected.subject?.id || ''}
          onChange={handleSubjectChange}
          disabled={!selected.course}
        />
        
        <SelectDropdown
          label="Unit"
          options={data.units}
          value={selected.unit?.id || ''}
          onChange={handleUnitChange}
          disabled={!selected.subject}
        />
        
        <SelectDropdown
          label="Chapter"
          options={data.chapters}
          value={selected.chapter?.id || ''}
          onChange={handleChapterChange}
          disabled={!selected.unit}
        />
        
        <SelectDropdown
          label="Topic"
          options={data.topics}
          value={selected.topic?.id || ''}
          onChange={handleTopicChange}
          disabled={!selected.chapter}
        />
      </div>

      {selected.topic && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Selected Path:</h3>
          <p className="text-blue-700">
            {selected.exam?.name} → {selected.course?.name} → {selected.subject?.name} → {selected.unit?.name} → {selected.chapter?.name} → {selected.topic?.name}
          </p>
        </div>
      )}
    </div>
  )
}