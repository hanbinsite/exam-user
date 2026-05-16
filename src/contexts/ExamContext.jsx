import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { post } from '../services/api';
import { judgmentToApi, normalizeMultiAnswer } from '../services/adapter';

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
      let mcTotal = 0, mcAnswered = 0;
      questions.forEach(q => {
        if (q.__type === 'multi_choice') {
          mcTotal++;
          const a = answers[String(q.id)];
          if (Array.isArray(a) ? a.length > 0 : a !== undefined) mcAnswered++;
        }
      });
      const typeScores = scoreResult.type_scores || {};
      const mcScore = typeScores.multi_choice || {};
      return {
        totalChoice: scoreResult.choice_total || 0,
        totalMultiChoice: mcScore.total || mcTotal,
        totalJudgment: scoreResult.judgment_total || 0,
        answeredChoice: scoreResult.choice_total || 0,
        answeredMultiChoice: mcScore.total || mcAnswered,
        answeredJudgment: scoreResult.judgment_total || 0,
        correctChoice: scoreResult.choice_correct || 0,
        correctMultiChoice: mcScore.correct || 0,
        correctJudgment: scoreResult.judgment_correct || 0,
        wrongChoice: (scoreResult.choice_total || 0) - (scoreResult.choice_correct || 0),
        wrongMultiChoice: (mcScore.total || mcAnswered) - (mcScore.correct || 0),
        wrongJudgment: (scoreResult.judgment_total || 0) - (scoreResult.judgment_correct || 0),
        totalScore: scoreResult.total_score,
        wrongCount: scoreResult.wrong_count,
      };
    }

    const showCorrect = mode !== 'exam';

    let totalChoice = 0, totalMultiChoice = 0, totalJudgment = 0;
    let answeredChoice = 0, answeredMultiChoice = 0, answeredJudgment = 0;
    let correctChoice = 0, correctMultiChoice = 0, correctJudgment = 0;
    let wrongChoice = 0, wrongMultiChoice = 0, wrongJudgment = 0;

    questions.forEach(q => {
      const type = q.__type;
      const ans = answers[String(q.id)];
      let hasAnswer, isCorrect;

      if (type === 'choice') {
        totalChoice++;
        hasAnswer = ans !== undefined;
        if (hasAnswer) answeredChoice++;
        if (showCorrect) {
          isCorrect = ans === q.answer;
          if (isCorrect) correctChoice++;
          else if (hasAnswer) wrongChoice++;
        }
      } else if (type === 'multi_choice') {
        totalMultiChoice++;
        hasAnswer = Array.isArray(ans) ? ans.length > 0 : ans !== undefined;
        if (hasAnswer) answeredMultiChoice++;
        if (showCorrect) {
          const answerArr = normalizeMultiAnswer(q.answer);
          isCorrect = Array.isArray(ans) && ans.length === answerArr.length && ans.every(k => answerArr.includes(k));
          if (isCorrect) correctMultiChoice++;
          else if (hasAnswer) wrongMultiChoice++;
        }
      } else if (type === 'judgment') {
        totalJudgment++;
        hasAnswer = ans !== undefined;
        if (hasAnswer) answeredJudgment++;
        if (showCorrect) {
          isCorrect = ans === q.answer;
          if (isCorrect) correctJudgment++;
          else if (hasAnswer) wrongJudgment++;
        }
      }
    });

    return {
      totalChoice, totalMultiChoice, totalJudgment,
      answeredChoice, answeredMultiChoice, answeredJudgment,
      correctChoice, correctMultiChoice, correctJudgment,
      wrongChoice, wrongMultiChoice, wrongJudgment,
    };
  }, [questions, answers, mode, scoreResult]);

  const providerValue = useMemo(() => ({
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
  }), [questions, answers, setAnswer, stats, mode, scoreResult, examSubmitted, submitting, submitExam, clearAnswers]);

  return (
    <ExamContext.Provider value={providerValue}>
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
