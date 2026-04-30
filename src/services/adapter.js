const JUDGMENT_FROM_API = { '对': true, '错': false };
const JUDGMENT_TO_API = { true: '对', false: '错' };

export function adaptQuestion(q) {
  const adapted = {
    id: q.id,
    question: q.title,
    options: q.content?.options || [],
    __type: q.type?.name,
    category: q.category,
    difficulty: q.difficulty,
    score: q.score,
    explanation: q.explanation,
  };

  if (q.answer !== undefined && q.answer !== null) {
    if (q.type?.name === 'judgment') {
      adapted.answer = JUDGMENT_FROM_API[q.answer] ?? q.answer;
    } else {
      adapted.answer = q.answer;
    }
  }

  return adapted;
}

export function adaptSubject(s) {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    category: s.category,
    icon: s.icon,
    stats: s.stats,
  };
}

export function judgmentToApi(value) {
  return JUDGMENT_TO_API[value] ?? value;
}
