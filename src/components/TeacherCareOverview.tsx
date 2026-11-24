import { useState } from 'react';
import { Check, CheckCircle2, HeartHandshake, Sun } from 'lucide-react';
import type {
  CounselingRequest,
  CounselingStatus,
  MorningGreeting,
  Student,
} from '../types/classroom';
import { CharacterAvatar } from './CharacterAvatar';

interface TeacherCareOverviewProps {
  students: Student[];
  morningGreetings: MorningGreeting[];
  counselingRequests: CounselingRequest[];
  onCheckMorningGreeting: (greetingId: string, replyText: string) => void;
  onUpdateCounselingStatus: (requestId: string, status: CounselingStatus) => void;
}

export function TeacherCareOverview({
  students,
  morningGreetings,
  counselingRequests,
  onCheckMorningGreeting,
  onUpdateCounselingStatus,
}: TeacherCareOverviewProps) {
  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const filteredGreetings =
    studentFilter === 'all'
      ? morningGreetings
      : morningGreetings.filter((item) => item.studentId === studentFilter);

  const filteredCounselings =
    studentFilter === 'all'
      ? counselingRequests
      : counselingRequests.filter((item) => item.studentId === studentFilter);

  const getStudentAvatar = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.character ?? students[0].character;
  };

  const submittedStudentIds = new Set(morningGreetings.map((g) => g.studentId));
  const uncheckedGreetingsCount = morningGreetings.filter((g) => !g.teacherChecked).length;
  const pendingCounselingCount = counselingRequests.filter((c) => c.status === 'pending').length;

  return (
    <section
      aria-labelledby="teacher-care-heading"
      className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 flex flex-col gap-6"
    >
      {/* Header & Student Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h1 id="teacher-care-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
            교사용 아침인사 · 상담 신청 관리
          </h1>
          <p className="text-sm text-slate-600 mt-1 tabular-nums">
            아침인사 제출 {submittedStudentIds.size}/{students.length}명 · 미확인{' '}
            {uncheckedGreetingsCount}건 · 상담 신청 {counselingRequests.length}건 · 대기{' '}
            {pendingCounselingCount}건
          </p>
        </div>

        <div
          role="group"
          aria-label="학생별 기록 필터"
          className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start lg:self-auto"
        >
          <button
            type="button"
            onClick={() => setStudentFilter('all')}
            aria-pressed={studentFilter === 'all'}
            className={`min-h-10 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              studentFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            전체 학생
          </button>
          {students.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => setStudentFilter(student.id)}
              aria-pressed={studentFilter === student.id}
              className={`min-h-10 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                studentFilter === student.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {student.name}
            </button>
          ))}
        </div>
      </div>

      {/* Student Roster Morning Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {students.map((student) => {
          const latestGreeting = morningGreetings.find((g) => g.studentId === student.id);
          const studentPendingCounseling = counselingRequests.filter(
            (c) => c.studentId === student.id && c.status !== 'completed'
          ).length;
          const isFiltered = studentFilter === student.id;

          return (
            <button
              key={student.id}
              type="button"
              onClick={() =>
                setStudentFilter((prev) => (prev === student.id ? 'all' : student.id))
              }
              aria-pressed={isFiltered}
              className={`text-left rounded-2xl border p-4 flex items-center gap-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] ${
                isFiltered
                  ? 'bg-[#F0F9FF] border-[#0284C7]'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <CharacterAvatar character={student.character} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {student.number}번 {student.name}
                  </p>
                  {studentPendingCounseling > 0 && (
                    <span className="text-xs font-semibold text-[#4F46E5] tabular-nums whitespace-nowrap">
                      상담 {studentPendingCounseling}건
                    </span>
                  )}
                </div>
                {latestGreeting ? (
                  <p className="text-xs text-slate-600 mt-0.5 truncate tabular-nums">
                    {latestGreeting.moodEmoji} {latestGreeting.moodLabel} · {latestGreeting.createdAt}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 mt-0.5">아침인사 미제출</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Two-Column Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Column 1: Morning Greetings */}
        <div
          id="morning-greeting"
          className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  학생별 아침인사 도착함
                </h2>
                <p className="text-xs text-slate-600">
                  다른 학생은 볼 수 없고 교사만 전체 응답을 확인할 수 있어요.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 tabular-nums whitespace-nowrap">
              {filteredGreetings.length}건
            </span>
          </div>

          {filteredGreetings.length === 0 ? (
            <div className="rounded-xl bg-white border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm font-semibold text-slate-800">
                아직 제출된 아침인사가 없어요.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                학생용 보기 화면에서 학생이 아침인사를 제출하면 이곳에 바로 표시됩니다.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filteredGreetings.map((item) => {
                const draft = replyDrafts[item.id] ?? '';
                return (
                  <li
                    key={item.id}
                    className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <CharacterAvatar character={getStudentAvatar(item.studentId)} size="sm" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {item.studentName}
                            <span className="mx-1.5 text-slate-300" aria-hidden="true">
                              ·
                            </span>
                            <span className="text-[#0369A1]">
                              {item.moodEmoji} {item.moodLabel}
                            </span>
                          </p>
                          <p className="text-xs text-slate-500 tabular-nums">
                            {item.createdAt} 제출
                          </p>
                        </div>
                      </div>

                      {item.teacherChecked ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>확인 완료</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 whitespace-nowrap">
                          미확인
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-slate-800 space-y-1.5 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                      <p>
                        <strong className="text-slate-900">기분 이유:</strong> {item.reason}
                      </p>
                      {item.messageToTeacher && (
                        <p>
                          <strong className="text-[#0369A1]">선생님께 한마디:</strong>{' '}
                          {item.messageToTeacher}
                        </p>
                      )}
                    </div>

                    {!item.teacherChecked ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={draft}
                          onChange={(e) =>
                            setReplyDrafts((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          placeholder="짧은 답장 남기기 (선택)"
                          aria-label={`${item.studentName} 학생 아침인사 답장`}
                          className="flex-1 min-h-10 rounded-xl bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onCheckMorningGreeting(item.id, draft.trim());
                            setReplyDrafts((prev) => {
                              const next = { ...prev };
                              delete next[item.id];
                              return next;
                            });
                          }}
                          className="inline-flex items-center justify-center gap-1.5 min-h-10 px-4 py-2 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>확인 완료</span>
                        </button>
                      </div>
                    ) : (
                      item.teacherReply && (
                        <p className="text-xs text-[#0C4A6E] bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3 py-2">
                          <strong>선생님 답장:</strong> {item.teacherReply}
                        </p>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Column 2: Counseling Requests */}
        <div
          id="counseling-request"
          className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  선생님 상담 신청 현황
                </h2>
                <p className="text-xs text-slate-600">
                  학생이 신청한 상담 주제를 확인하고 진행 상태를 표시해 주세요.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 tabular-nums whitespace-nowrap">
              {filteredCounselings.length}건
            </span>
          </div>

          {filteredCounselings.length === 0 ? (
            <div className="rounded-xl bg-white border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm font-semibold text-slate-800">
                아직 신청된 상담이 없어요.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                학생용 보기 화면에서 상담을 신청하면 이곳에서 바로 확인하고 응답할 수 있어요.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filteredCounselings.map((req) => (
                <li
                  key={req.id}
                  className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <CharacterAvatar character={getStudentAvatar(req.studentId)} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {req.studentName}
                          <span className="mx-1.5 text-slate-300" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-[#4F46E5]">{req.topic}</span>
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums">
                          희망: {req.preferredTime} · {req.createdAt} 신청
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold whitespace-nowrap ${
                        req.status === 'completed'
                          ? 'text-emerald-700'
                          : req.status === 'confirmed'
                          ? 'text-[#0284C7]'
                          : 'text-amber-700'
                      }`}
                    >
                      {req.status === 'completed'
                        ? '상담 완료'
                        : req.status === 'confirmed'
                        ? '확인 완료'
                        : '대기 중'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-800 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    {req.message}
                  </p>

                  {req.status !== 'completed' && (
                    <div className="flex items-center gap-2 pt-1">
                      {req.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => onUpdateCounselingStatus(req.id, 'confirmed')}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-10 px-3 py-2 text-xs font-semibold text-[#0369A1] bg-[#F0F9FF] hover:bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>확인 완료</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onUpdateCounselingStatus(req.id, 'completed')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-10 px-3 py-2 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        <span>상담 완료 처리</span>
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
