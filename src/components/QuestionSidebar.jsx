import { useState } from 'react';

const TYPE_LABELS = {
  choice: { label: '单选题', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  multi_choice: { label: '多选题', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  judgment: { label: '判断题', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
};

function groupByType(questions) {
  const groups = [];
  let startIdx = 0;
  for (const type of ['choice', 'multi_choice', 'judgment']) {
    const filtered = [];
    questions.forEach((q, i) => {
      if (q.__type === type) filtered.push({ ...q, globalIdx: i });
    });
    if (filtered.length > 0) {
      groups.push({ type, items: filtered, startIdx });
      startIdx += filtered.length;
    }
  }
  return groups;
}

export default function QuestionSidebar({
  questions,
  answers,
  currentIndex,
  mode,
  onJump,
  onSubmit,
  onEnd,
  submitting,
}) {
  const [open, setOpen] = useState(false);
  const groups = groupByType(questions);
  const answeredCount = questions.filter(q => {
    const a = answers[String(q.id)];
    if (q.__type === 'multi_choice') return Array.isArray(a) ? a.length > 0 : a !== undefined;
    return a !== undefined;
  }).length;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">答题卡</h3>
          <span className="text-xs text-gray-500">{answeredCount}/{questions.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / Math.max(questions.length, 1)) * 100}%` }}
          />
        </div>

        {groups.map(group => {
          const t = TYPE_LABELS[group.type] || {};
          return (
            <div key={group.type}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${t.dot || 'bg-gray-400'}`} />
                <span className={`text-xs font-semibold ${t.text || 'text-gray-600'}`}>
                  {t.label || group.type}
                </span>
                <span className="text-xs text-gray-400">{group.items.length}题</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {group.items.map(item => {
                  const a = answers[String(item.id)];
                  const isAnswered = item.__type === 'multi_choice'
                    ? Array.isArray(a) ? a.length > 0 : a !== undefined
                    : a !== undefined;
                  const isCurrent = item.globalIdx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { onJump(item.globalIdx); setOpen(false); }}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-indigo-400 ring-offset-1'
                          : ''
                      } ${
                        isAnswered
                          ? 'bg-indigo-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {item.globalIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        {mode === 'exam' ? (
          <button
            onClick={onSubmit}
            disabled={submitting || answeredCount === 0}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                提交答案
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onEnd}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
          >
            结束练习
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-fit sticky top-6 max-h-[calc(100vh-3rem)]">
        {sidebarContent}
      </div>

      {/* Mobile hamburger */}
      <div className="lg:hidden fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="打开答题卡"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-80 max-w-[85vw] bg-white h-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">答题卡</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
