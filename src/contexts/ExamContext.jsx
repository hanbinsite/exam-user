import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { post } from '../services/api';
import { judgmentToApi } from '../services/adapter';

const ExamContext = createContext();

function getStorageKey(subjectId, mode, examSessionId) {
  if (mode === 'exam' && examSessionId) {
    return `exam-${subjectId}-${examSessionId}`;
  }
  return `answers-${subjectId}-${mode}`;
}

export function ExamProvider({ children, questions, mode, subjectId, examSessionId }) {
  const [answers, setAnswers] = useState({});
  const [scoreResult, setScoreResult] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = getStorageKey(subjectId, mode, examSessionId);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const valid = {};
        const questionIds = new Set(questions.map(q => String(q.id)));
        for (const [id, val] of Object.entries(parsed)) {
          if (questionIds.has(id)) valid[id] = val;
        }
        setAnswers(valid);
      } catch {}
    } else if (mode === 'study' && questions.length > 0) {
      const autoAnswers = {};
      questions.forEach(q => {
        if (q.answer !== undefined) {
          if (q.__type === 'multi_choice') {
            autoAnswers[String(q.id)] = q.answer.split('');
          } else {
            autoAnswers[String(q.id)] = q.answer;
          }
        }
      });
      setAnswers(autoAnswers);
    } else {
      setAnswers({});
    }
    setScoreResult(null);
    setExamSubmitted(false);
  }, [storageKey, questions, mode]);

  useEffect(() => {
    if (Object.keys(answers).length > 0 && mode === 'exam' && !examSubmitted) {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    }
  }, [answers, storageKey, mode, examSubmitted]);

  const setAnswer = useCallback((id, value) => {
    setAnswers(prev => ({ ...prev, [String(id)]: value }));
  }, []);

  const clearAnswers = useCallback(() => {
    setAnswers({});
    localStorage.removeItem(storageKey);
    setScoreResult(null);
    setExamSubmitted(false);
  }, [storageKey]);

  const submitExam = useCallback(async () => {
    if (!examSessionId) return;
    setSubmitting(true);
    try {
      const apiAnswers = {};
      for (const [qId, answer] of Object.entries(answers)) {
        const question = questions.find(q => String(q.id) === qId);
        if (question?.__type === 'judgment') {
          apiAnswers[qId] = judgmentToApi(answer);
        } else if (question?.__type === 'multi_choice') {
          apiAnswers[qId] = Array.isArray(answer) ? answer.join('') : answer;
        } else {
          apiAnswers[qId] = answer;
        }
      }
      const result = await post(`/exams/session/${examSessionId}/submit`, { answers: apiAnswers });
      setScoreResult(result);
      setExamSubmitted(true);
      localStorage.removeItem(storageKey);
      return result;
    } finally {
      setSubmitting(false);
    }
  }, [answers, examSessionId, questions, storageKey]);

  const stats = useMemo(() => {
    if (mode === 'exam' && scoreResult) {
      return {
        totalChoice: scoreResult.choice_total || 0,
        totalMultiChoice: scoreResult.multi_choice_total || 0,
        totalJudgment: scoreResult.judgment_total || 0,
        answeredChoice: scoreResult.choice_total || 0,
        answeredMultiChoice: scoreResult.multi_choice_total || 0,
        answeredJudgment: scoreResult.judgment_total || 0,
        correctChoice: scoreResult.choice_correct || 0,
        correctMultiChoice: scoreResult.multi_choice_correct || 0,
        correctJudgment: scoreResult.judgment_correct || 0,
        wrongChoice: (scoreResult.choice_total || 0) - (scoreResult.choice_correct || 0),
        wrongMultiChoice: (scoreResult.multi_choice_total || 0) - (scoreResult.multi_choice_correct || 0),
        wrongJudgment: (scoreResult.judgment_total || 0) - (scoreResult.judgment_correct || 0),
        totalScore: scoreResult.total_score,
        wrongCount: scoreResult.wrong_count,
      };
    }

    const choiceQs = questions.filter(q => q.__type === 'choice');
    const multiChoiceQs = questions.filter(q => q.__type === 'multi_choice');
    const judgmentQs = questions.filter(q => q.__type === 'judgment');

    const answeredChoice = choiceQs.filter(q => answers[String(q.id)] !== undefined).length;
    const answeredMultiChoice = multiChoiceQs.filter(q => {
      const a = answers[String(q.id)];
      return Array.isArray(a) ? a.length > 0 : a !== undefined;
    }).length;
    const answeredJudgment = judgmentQs.filter(q => answers[String(q.id)] !== undefined).length;

    const showCorrect = mode !== 'exam';

    const isMultiChoiceCorrect = (q) => {
      const a = answers[String(q.id)];
      if (!Array.isArray(a) || a.length === 0) return false;
      const answerArr = q.answer ? q.answer.split('') : [];
      return a.length === answerArr.length && a.every(k => answerArr.includes(k));
    };

    return {
      totalChoice: choiceQs.length,
      totalMultiChoice: multiChoiceQs.length,
      totalJudgment: judgmentQs.length,
      answeredChoice,
      answeredMultiChoice,
      answeredJudgment,
      correctChoice: showCorrect ? choiceQs.filter(q => answers[String(q.id)] === q.answer).length : 0,
      correctMultiChoice: showCorrect ? multiChoiceQs.filter(q => isMultiChoiceCorrect(q)).length : 0,
      correctJudgment: showCorrect ? judgmentQs.filter(q => answers[String(q.id)] === q.answer).length : 0,
      wrongChoice: showCorrect ? choiceQs.filter(q => answers[String(q.id)] !== undefined && answers[String(q.id)] !== q.answer).length : 0,
      wrongMultiChoice: showCorrect ? multiChoiceQs.filter(q => {
        const a = answers[String(q.id)];
        const hasAnswer = Array.isArray(a) ? a.length > 0 : a !== undefined;
        return hasAnswer && !isMultiChoiceCorrect(q);
      }).length : 0,
      wrongJudgment: showCorrect ? judgmentQs.filter(q => answers[String(q.id)] !== undefined && answers[String(q.id)] !== q.answer).length : 0,
    };
  }, [questions, answers, mode, scoreResult]);

  return (
    <ExamContext.Provider value={{
      questions,
      answers,
      setAnswer,
      stats,
      mode,
      scoreResult,
      examSubmitted,
      submitting,
      submitExam,
      clearAnswers,
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
