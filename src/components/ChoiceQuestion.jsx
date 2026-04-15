import { useExam } from '../contexts/ExamContext';

export default function ChoiceQuestion({ question, index }) {
  const { choiceAnswers, setChoiceAnswer } = useExam();
  const selected = choiceAnswers[question.id];
  const isAnswered = selected !== undefined;
  const isCorrect = selected === question.answer;

  const getOptionClass = (optionKey) => {
    if (!isAnswered) {
      return 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
    }
    if (optionKey === question.answer) {
      return 'border-green-500 bg-green-50 text-green-800';
    }
    if (optionKey === selected && selected !== question.answer) {
      return 'border-red-500 bg-red-50 text-red-800';
    }
    return 'border-gray-200 opacity-60';
  };

  const handleSelect = (optionKey) => {
    if (!isAnswered) {
      setChoiceAnswer(question.id, optionKey);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4 border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed flex-1">{question.question}</p>
      </div>
      
      <div className="space-y-2 ml-11">
        {question.options.map((option) => (
          <div
            key={option.key}
            onClick={() => handleSelect(option.key)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${getOptionClass(option.key)}`}
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center font-medium text-sm">
              {option.key}
            </span>
            <span className="flex-1">{option.text}</span>
            {isAnswered && option.key === question.answer && (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {isAnswered && option.key === selected && selected !== question.answer && (
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {isAnswered && (
        <div className={`mt-4 ml-11 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? '✓ 回答正确！' : `✗ 回答错误，正确答案是 ${question.answer}`}
        </div>
      )}
    </div>
  );
}
