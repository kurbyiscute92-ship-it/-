import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, GraduationCap, Info, Lock, X } from 'lucide-react';
import { CharacterAvatar } from './components/CharacterAvatar';
import { HeaderBar } from './components/HeaderBar';
import { StudentMorningAndCounseling } from './components/StudentMorningAndCounseling';
import { TeacherCareOverview } from './components/TeacherCareOverview';
import { INITIAL_STUDENTS } from './data/classroomData';
import type {
  CounselingRequest,
  CounselingStatus,
  CounselingTopic,
  FeedbackNotice,
  MoodOption,
  MorningGreeting,
  ViewMode,
} from './types/classroom';

const GREETINGS_STORAGE_KEY = 'classroom-morning-greetings-v1';
const COUNSELING_STORAGE_KEY = 'classroom-counseling-requests-v1';

function loadStoredList<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatTimeNow(): string {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function App() {
  const students = INITIAL_STUDENTS;
  const [morningGreetings, setMorningGreetings] = useState<MorningGreeting[]>(() =>
    loadStoredList<MorningGreeting>(GREETINGS_STORAGE_KEY)
  );
  const [counselingRequests, setCounselingRequests] = useState<CounselingRequest[]>(() =>
    loadStoredList<CounselingRequest>(COUNSELING_STORAGE_KEY)
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(INITIAL_STUDENTS[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const [notice, setNotice] = useState<FeedbackNotice | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(GREETINGS_STORAGE_KEY, JSON.stringify(morningGreetings));
    } catch {
      // Ignore storage write errors in restricted iframes
    }
  }, [morningGreetings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COUNSELING_STORAGE_KEY, JSON.stringify(counselingRequests));
    } catch {
      // Ignore storage write errors in restricted iframes
    }
  }, [counselingRequests]);

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ?? students[0];

  const showNotice = (type: FeedbackNotice['type'], message: string) => {
    setNotice({ id: Date.now(), type, message });
  };

  const handleSubmitMorningGreeting = (
    studentId: string,
    mood: MoodOption,
    reason: string,
    messageToTeacher: string
  ) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    const newGreeting: MorningGreeting = {
      id: `greeting-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      moodId: mood.id,
      moodEmoji: mood.emoji,
      moodLabel: mood.label,
      reason,
      messageToTeacher,
      createdAt: formatTimeNow(),
      teacherChecked: false,
    };

    setMorningGreetings((prev) => [newGreeting, ...prev]);
    showNotice(
      'success',
      `${targetStudent.name} 학생의 오늘 아침인사(${mood.emoji} ${mood.label})가 선생님께 전달되었어요. (다른 친구는 볼 수 없어요)`
    );
  };

  const handleCheckMorningGreeting = (greetingId: string, replyText: string) => {
    if (viewMode !== 'teacher') return;

    const targetGreeting = morningGreetings.find((g) => g.id === greetingId);
    if (!targetGreeting || targetGreeting.teacherChecked) return;

    setMorningGreetings((prev) =>
      prev.map((g) =>
        g.id === greetingId
          ? {
              ...g,
              teacherChecked: true,
              teacherReply: replyText || undefined,
            }
          : g
      )
    );

    showNotice(
      'success',
      replyText
        ? `${targetGreeting.studentName} 학생의 아침인사를 확인하고 따뜻한 답장을 남겼어요.`
        : `${targetGreeting.studentName} 학생의 아침인사를 확인 완료했어요.`
    );
  };

  const handleSubmitCounseling = (
    studentId: string,
    topic: CounselingTopic,
    preferredTime: string,
    message: string
  ) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    const newReq: CounselingRequest = {
      id: `counseling-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      topic,
      preferredTime,
      message,
      createdAt: formatTimeNow(),
      status: 'pending',
    };

    setCounselingRequests((prev) => [newReq, ...prev]);
    showNotice(
      'success',
      `${targetStudent.name} 학생의 상담 신청이 선생님께 안전하게 전달되었어요. (다른 친구는 볼 수 없어요)`
    );
  };

  const handleUpdateCounselingStatus = (requestId: string, status: CounselingStatus) => {
    if (viewMode !== 'teacher') return;
    const targetReq = counselingRequests.find((c) => c.id === requestId);
    if (!targetReq) return;

    setCounselingRequests((prev) =>
      prev.map((c) => (c.id === requestId ? { ...c, status } : c))
    );

    showNotice(
      'info',
      `${targetReq.studentName} 학생의 상담 신청을 '${
        status === 'completed' ? '상담 완료' : '확인 완료'
      }' 상태로 변경했어요.`
    );
  };

  const handleResetDemo = () => {
    setMorningGreetings([]);
    setCounselingRequests([]);
    setSelectedStudentId(INITIAL_STUDENTS[0].id);
    try {
      window.localStorage.removeItem(GREETINGS_STORAGE_KEY);
      window.localStorage.removeItem(COUNSELING_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
    setNotice({
      id: Date.now(),
      type: 'info',
      message: '아침인사와 상담 신청 기록을 처음 상태로 되돌렸어요.',
    });
  };

  const submittedStudentCount = new Set(morningGreetings.map((g) => g.studentId)).size;
  const pendingCounselingCount = counselingRequests.filter(
    (c) => c.status === 'pending'
  ).length;

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <HeaderBar onResetDemo={handleResetDemo} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Workspace Mode Toolbar */}
        <section
          aria-label="화면 모드 전환"
          className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div
              role="group"
              aria-label="화면 보기 전환"
              className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start shrink-0"
            >
              <button
                type="button"
                onClick={() => {
                  setViewMode('student');
                  setNotice(null);
                }}
                aria-pressed={viewMode === 'student'}
                className={`inline-flex items-center gap-1.5 min-h-10 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                  viewMode === 'student'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>학생용 보기 화면</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('teacher');
                  setNotice(null);
                }}
                aria-pressed={viewMode === 'teacher'}
                className={`inline-flex items-center gap-1.5 min-h-10 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                  viewMode === 'teacher'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                <span>교사용 관리 화면</span>
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-snug">
              {viewMode === 'teacher'
                ? '모든 학생의 아침인사와 상담 신청 내용을 한눈에 확인하고 답장·진행 상태를 관리해요.'
                : '오늘의 기분을 담은 아침인사와 선생님께 상담 신청을 남기는 나만의 비공개 화면이에요.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 shrink-0">
            {viewMode === 'teacher' ? (
              <>
                <span className="tabular-nums">
                  아침인사{' '}
                  <strong className="text-[#0284C7]">
                    {submittedStudentCount}/{students.length}
                  </strong>
                  명
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  상담 대기 <strong className="text-[#4F46E5]">{pendingCounselingCount}</strong>건
                </span>
              </>
            ) : (
              <span>
                내 화면 · <strong className="text-[#0284C7]">{selectedStudent.name}</strong>
              </span>
            )}
          </div>
        </section>

        {/* Inline Action Feedback Notice */}
        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-2xl border px-4 py-3.5 flex items-center justify-between gap-3 ${
              notice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : notice.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0C4A6E]'
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {notice.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
              )}
              {notice.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              )}
              {notice.type === 'info' && <Info className="w-5 h-5 shrink-0" aria-hidden="true" />}
              <span>{notice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="안내 닫기"
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Private Student Switcher (Student View only; names & avatars only, zero peer data) */}
        {viewMode === 'student' && (
          <section
            aria-label="내 이름 선택하기"
            className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-2.5 text-sm text-slate-600">
              <Lock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
              <span>
                <strong className="text-slate-900">내 이름 선택:</strong> 다른 친구의 응답은 볼 수 없고 오직 선생님만 확인할 수 있어요.
              </span>
            </div>

            <div
              role="group"
              aria-label="내 이름 선택 버튼"
              className="flex flex-wrap items-center gap-2"
            >
              {students.map((student) => {
                const isActive = student.id === selectedStudent.id;
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setNotice(null);
                    }}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 min-h-11 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CharacterAvatar character={student.character} size="xs" />
                    <span>{student.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Main Workspace: Student Morning Greeting & Counseling OR Teacher Overview */}
        {viewMode === 'student' ? (
          <StudentMorningAndCounseling
            key={selectedStudent.id}
            student={selectedStudent}
            morningGreetings={morningGreetings}
            counselingRequests={counselingRequests}
            onSubmitMorningGreeting={handleSubmitMorningGreeting}
            onSubmitCounseling={handleSubmitCounseling}
          />
        ) : (
          <TeacherCareOverview
            students={students}
            morningGreetings={morningGreetings}
            counselingRequests={counselingRequests}
            onCheckMorningGreeting={handleCheckMorningGreeting}
            onUpdateCounselingStatus={handleUpdateCounselingStatus}
          />
        )}
      </main>
    </div>
  );
}
