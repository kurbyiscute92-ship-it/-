export type ViewMode = 'teacher' | 'student';

export type CharacterId = 'squirrel' | 'cat' | 'bear' | 'puppy';

export interface CharacterTheme {
  id: CharacterId;
  label: string;
  pngSrc: string | null;
  avatarBg: string;
  avatarBorder: string;
  accentText: string;
  selectedRing: string;
}

export interface Student {
  id: string;
  name: string;
  number: number;
  character: CharacterTheme;
}

export type MoodId =
  | 'happy'
  | 'excited'
  | 'calm'
  | 'sleepy'
  | 'okay'
  | 'sad'
  | 'angry'
  | 'worried';

export interface MoodOption {
  id: MoodId;
  emoji: string;
  label: string;
}

export interface MorningGreeting {
  id: string;
  studentId: string;
  studentName: string;
  moodId: MoodId;
  moodEmoji: string;
  moodLabel: string;
  reason: string;
  messageToTeacher: string;
  createdAt: string;
  teacherChecked: boolean;
  teacherReply?: string;
}

export type CounselingTopic = '친구 고민' | '공부·숙제' | '마음 이야기' | '기타';
export type CounselingStatus = 'pending' | 'confirmed' | 'completed';

export interface CounselingRequest {
  id: string;
  studentId: string;
  studentName: string;
  topic: CounselingTopic;
  preferredTime: string;
  message: string;
  createdAt: string;
  status: CounselingStatus;
}

export interface FeedbackNotice {
  id: number;
  type: 'success' | 'warning' | 'info';
  message: string;
}
