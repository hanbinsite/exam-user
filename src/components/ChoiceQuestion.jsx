import { useExam } from '../contexts/ExamContext';

export default function ChoiceQuestion({ question, index }) {
  const { answers, setAnswer, mode, examSubmitted } = useExam();
  const selected = answers[String(question.id)];
  const isAnswered = selected !== undefined;
  const showFeedback = mode !== 'exam' || examSubmitted;
  const isCorrect = showFeedback && selected === question.answer;

  const getOptionClass = (optionKey) => {
    if (!isAnswered) {
      return 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer hover:shadow-md';
    }
    if (showFeedback) {
      if (optionKey === question.answer) {
        return 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 shadow-md';
      }
      if (optionKey === selected && selected !== question.answer) {
        return 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50 text-red-800 shadow-md';
      }
    } else {
      if (optionKey === selected) {
        return 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-800 shadow-md';
      }
    }
    return 'border-gray-100 opacity-50 bg-gray-50';
  };

  const handleSelect = (optionKey) => {
    if (examSubmitted) return;
    if (!isAnswered || mode === 'exam') {
      if (mode !== 'exam' && isAnswered) return;
      setAnswer(question.id, optionKey);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex items-start gap-4 mb-5">
        <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed flex-1 text-base">{question.question}</p>
      </div>

      <div className="space-y-3 ml-14">
        {question.options.map((option) => (
          <div
            key={option.key}
            onClick={() => handleSelect(option.key)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${getOptionClass(option.key)}`}
          >
            <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm transition-all ${
              showFeedback && isAnswered && option.key === question.answer
                ? 'bg-green-500 text-white'
                : showFeedback && isAnswered && option.key === selected && selected !== question.answer
                  ? 'bg-red-500 text-white'
                  : !showFeedback && isAnswered && option.key === selected
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-600'
            }`}>
              {option.key}
            </span>
            <span className="flex-1 text-base">{option.text}</span>
            {showFeedback && isAnswered && option.key === question.answer && (
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {showFeedback && isAnswered && option.key === selected && selected !== question.answer && (
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {showFeedback && isAnswered && mode !== 'study' && mode !== 'exam' && (
        <div className={`mt-5 ml-14 p-4 rounded-xl flex items-center gap-3 ${
          isCorrect
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
        }`}>
          {isCorrect ? (
            <>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">回答正确！</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">回答错误，正确答案是 <span className="bg-white px-2 py-1 rounded font-bold">{question.answer}</span></span>
            </>
          )}
        </div>
      )}

      {!showFeedback && isAnswered && (
        <div className="mt-5 ml-14 p-4 rounded-xl flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border border-indigo-200">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium">已作答</span>
        </div>
      )}
    </div>
  );
}
