import React from 'react';
import PlatformIntroModal from './PlatformIntroModal';
import CoursePreviewModal from './CoursePreviewModal';
import type { CourseCard, Course } from '../../types';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  course?: CourseCard | Course | null;
}

export default function TrailerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
  course,
}: TrailerModalProps) {
  if (videoUrl || course || (title && title.toLowerCase().includes('course'))) {
    return (
      <CoursePreviewModal
        isOpen={isOpen}
        onClose={onClose}
        course={course}
        videoUrl={videoUrl}
        title={title}
      />
    );
  }

  return (
    <PlatformIntroModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'SkillMint Platform Overview & Tour'}
    />
  );
}
