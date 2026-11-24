import type { CharacterTheme, MoodOption, Student } from '../types/classroom';

export const CHARACTER_THEMES: Record<'minjun' | 'seoa' | 'jiwoo' | 'hajun', CharacterTheme> = {
  minjun: {
    id: 'squirrel',
    label: '도토리 다람쥐',
    pngSrc: null,
    avatarBg: 'bg-[#FFF0E5]',
    avatarBorder: 'border-[#F7C9A9]',
    accentText: 'text-[#B45309]',
    selectedRing: 'ring-2 ring-[#0284C7]',
  },
  seoa: {
    id: 'cat',
    label: '복숭아 고양이',
    pngSrc: null,
    avatarBg: 'bg-[#FCEEF3]',
    avatarBorder: 'border-[#F3C1D4]',
    accentText: 'text-[#BE185D]',
    selectedRing: 'ring-2 ring-[#0284C7]',
  },
  jiwoo: {
    id: 'bear',
    label: '하늘 곰돌이',
    pngSrc: null,
    avatarBg: 'bg-[#EAF4FF]',
    avatarBorder: 'border-[#B9D8FA]',
    accentText: 'text-[#1D4ED8]',
    selectedRing: 'ring-2 ring-[#0284C7]',
  },
  hajun: {
    id: 'puppy',
    label: '새싹 강아지',
    pngSrc: null,
    avatarBg: 'bg-[#ECF9F1]',
    avatarBorder: 'border-[#B5E6CA]',
    accentText: 'text-[#047857]',
    selectedRing: 'ring-2 ring-[#0284C7]',
  },
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-minjun',
    name: '민준',
    number: 1,
    character: CHARACTER_THEMES.minjun,
  },
  {
    id: 'student-seoa',
    name: '서아',
    number: 2,
    character: CHARACTER_THEMES.seoa,
  },
  {
    id: 'student-jiwoo',
    name: '지우',
    number: 3,
    character: CHARACTER_THEMES.jiwoo,
  },
  {
    id: 'student-hajun',
    name: '하준',
    number: 4,
    character: CHARACTER_THEMES.hajun,
  },
];

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'happy', emoji: '😊', label: '행복해요' },
  { id: 'excited', emoji: '🤩', label: '신나요' },
  { id: 'calm', emoji: '😌', label: '편안해요' },
  { id: 'sleepy', emoji: '😴', label: '졸려요' },
  { id: 'okay', emoji: '😐', label: '그냥 그래요' },
  { id: 'sad', emoji: '😢', label: '속상해요' },
  { id: 'angry', emoji: '😠', label: '화나요' },
  { id: 'worried', emoji: '😟', label: '걱정돼요' },
];
