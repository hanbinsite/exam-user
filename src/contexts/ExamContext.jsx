import { createContext, useContext, useState, useEffect } from 'react';

const ExamContext = createContext();

export function ExamProvider({ children, examData }) {
  const [choiceAnswers, setChoiceAnswers] = useState({});
  const [judgmentAnswers, setJudgmentAnswers] = useState({});

  useEffect(() => {
    const savedChoice = localStorage.getItem(`exam-${examData.info.title}-choice`);
    const savedJudgment = localStorage.getItem(`exam-${examData.info.title}-judgment`);
    if (savedChoice) setChoiceAnswers(JSON.parse(savedChoice));
    if (savedJudgment) setJudgmentAnswers(JSON.parse(savedJudgment));
  }, [examData.info.title]);

  useEffect(() => {
    localStorage.setItem(`exam-${examData.info.title}-choice`, JSON.stringify(choiceAnswers));
    localStorage.setItem(`exam-${examData.info.title}-judgment`, JSON.stringify(judgmentAnswers));
  }, [choiceAnswers, judgmentAnswers, examData.info.title]);

  const setChoiceAnswer = (id, answer) => {
    setChoiceAnswers(prev => ({ ...prev, [id]: answer }));
  };

  const setJudgmentAnswer = (id, answer) => {
    setJudgmentAnswers(prev => ({ ...prev, [id]: answer }));
  };

  const resetAnswers = () => {
    setChoiceAnswers({});
    setJudgmentAnswers({});
    localStorage.removeItem(`exam-${examData.info.title}-choice`);
    localStorage.removeItem(`exam-${examData.info.title}-judgment`);
  };

  const stats = {
    totalChoice: examData.choiceQuestions.length,
    totalJudgment: examData.judgmentQuestions.length,
    answeredChoice: Object.keys(choiceAnswers).length,
    answeredJudgment: Object.keys(judgmentAnswers).length,
    correctChoice: examData.choiceQuestions.filter(q => choiceAnswers[q.id] === q.answer).length,
    correctJudgment: examData.judgmentQuestions.filter(q => judgmentAnswers[q.id] === q.answer).length,
    wrongChoice: examData.choiceQuestions.filter(q => choiceAnswers[q.id] && choiceAnswers[q.id] !== q.answer).length,
    wrongJudgment: examData.judgmentQuestions.filter(q => judgmentAnswers[q.id] !== undefined && judgmentAnswers[q.id] !== q.answer).length,
  };

  return (
    <ExamContext.Provider value={{
      examData,
      choiceAnswers,
      judgmentAnswers,
      setChoiceAnswer,
      setJudgmentAnswer,
      resetAnswers,
      stats,
    }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}
