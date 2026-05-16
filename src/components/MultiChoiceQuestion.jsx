import { useState } from 'react';
import { useExam } from '../contexts/ExamContext';

export default function MultiChoiceQuestion({ question, index }) {
  const { answers, setAnswer, mode, examSubmitted } = useExam();
  const selected = answers[String(question.id)];
  const selectedArr = Array.isArray(selected) ? selected : (selected ? [selected] : []);
  const isAnswered = selectedArr.length > 0;
  const showFeedback = mode !== 'exam' || examSubmitted;
  const [confirmed, setConfirmed] = useState(mode === 'study' || (mode === 'practice' && isAnswered));
  const effectiveShowFeedback = showFeedback && confirmed;
  const answerArr = question.answer ? question.answer.split('') : [];
  const isCorrect = effectiveShowFeedback && isAnswered && selectedArr.length === answerArr.length && selectedArr.every(k => answerArr.includes(k));

  const isSelected = (key) => selectedArr.includes(key);
  const isCorrectOption = (key) => answerArr.includes(key);

  const getOptionClass = (optionKey) => {
    if (!isAnswered) {
      return 'border-gray-200 hover:border-amber-400 hover:bg-amber-50 cursor-pointer hover:shadow-md';
    }
    if (effectiveShowFeedback) {
      if (isCorrectOption(optionKey)) {
        return 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 shadow-md';
      }
      if (isSelected(optionKey) && !isCorrectOption(optionKey)) {
        return 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50 text-red-800 shadow-md';
      }
    } else {
      if (isSelected(optionKey)) {
        return 'border-amber-500 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 shadow-md';
      }
    }
    return 'border-gray-100 opacity-50 bg-gray-50';
  };

  const handleToggle = (optionKey) => {
    if (examSubmitted) return;
    if (mode !== 'practice' && confirmed) return;

    let next;
    if (isSelected(optionKey)) {
      next = selectedArr.filter(k => k !== optionKey);
    } else {
      next = [...selectedArr, optionKey];
    }
    next.sort();
    setAnswer(question.id, next.length > 0 ? next : undefined);

    if (mode === 'practice' && confirmed) {
      setConfirmed(false);
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-6 mb-4 border border-gray-100">
      <div className="flex items-start gap-2 lg:gap-4 mb-3 lg:mb-5">
        <span className="flex-shrink-0 w-7 h-7 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg lg:rounded-xl flex items-center justify-center font-bold text-xs lg:text-sm shadow-lg">
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed flex-1 text-sm lg:text-base">{question.question}</p>
        <span className="flex-shrink-0 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">多选</span>
      </div>

      <div className="space-y-2 lg:space-y-3 ml-0 sm:ml-14">
        {question.options.map((option) => (
          <div
            key={option.key}
            onClick={() => handleToggle(option.key)}
            className={`flex items-center gap-2 lg:gap-4 p-3 lg:p-4 rounded-lg lg:rounded-xl border-2 transition-all ${getOptionClass(option.key)}`}
          >
            <span className={`flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center font-semibold text-xs lg:text-sm transition-all ${
              effectiveShowFeedback && isAnswered && isCorrectOption(option.key)
                ? 'bg-green-500 text-white'
                : effectiveShowFeedback && isAnswered && isSelected(option.key) && !isCorrectOption(option.key)
                  ? 'bg-red-500 text-white'
                  : !effectiveShowFeedback && isAnswered && isSelected(option.key)
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600'
            }`}>
              {option.key}
            </span>
            <span className="flex-1 text-sm lg:text-base">{option.text}</span>
            {effectiveShowFeedback && isAnswered && isCorrectOption(option.key) && (
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {effectiveShowFeedback && isAnswered && isSelected(option.key) && !isCorrectOption(option.key) && (
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {mode === 'practice' && isAnswered && !confirmed && (
        <div className="mt-3 lg:mt-5 ml-0 sm:ml-14">
          <button
            onClick={() => setConfirmed(true)}
            className="px-5 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg lg:rounded-xl font-medium text-sm lg:text-base hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
          >
            确认答案
          </button>
        </div>
      )}

      {effectiveShowFeedback && isAnswered && mode !== 'study' && mode !== 'exam' && (
        <div className={`mt-3 lg:mt-5 ml-0 sm:ml-14 p-3 lg:p-4 rounded-lg lg:rounded-xl flex items-center gap-2 lg:gap-3 ${
          isCorrect
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
        }`}>
          {isCorrect ? (
            <>
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-sm lg:text-base">回答正确！</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-sm lg:text-base">回答错误，正确答案是 <span className="bg-white px-2 py-1 rounded font-bold">{question.answer}</span></span>
            </>
          )}
        </div>
      )}

      {!effectiveShowFeedback && isAnswered && (
        <div className="mt-3 lg:mt-5 ml-0 sm:ml-14 p-3 lg:p-4 rounded-lg lg:rounded-xl flex items-center gap-2 lg:gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium text-sm lg:text-base">已作答（已选 {selectedArr.join('')}）</span>
        </div>
      )}
    </div>
  );
}
