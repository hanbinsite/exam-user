import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, '../raw-data/questions.txt'), 'utf-8');
const lines = rawData.split('\n');

const choiceQuestions = [];
const judgmentQuestions = [];

let currentQuestion = null;
let currentOptions = [];
let currentAnswer = null;
let pendingOptions = [];

function parseOptionsFromLine(line) {
  const options = [];
  
  let processedLine = line;
  if (!line.match(/^[A-D][、．.]/)) {
    processedLine = 'A、' + line;
  }
  
  const parts = processedLine.split(/\s+(?=[A-D][、．.])/);
  
  for (const part of parts) {
    const match = part.trim().match(/^([A-D])[、．.]\s*(.+)$/);
    if (match) {
      options.push({
        key: match[1],
        text: match[2].trim()
      });
    }
  }
  
  return options;
}

function finalizeChoiceQuestion() {
  if (!currentQuestion || currentOptions.length === 0 || !currentAnswer) return;
  
  choiceQuestions.push({
    id: choiceQuestions.length + 1,
    question: currentQuestion,
    options: currentOptions,
    answer: currentAnswer
  });
  
  currentQuestion = null;
  currentOptions = [];
  currentAnswer = null;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (!line) continue;
  
  const judgmentMatch = line.match(/^(\d+)[、．.]\s*[（\(]\s*([√×])/);
  if (judgmentMatch) {
    finalizeChoiceQuestion();
    
    const questionText = line.replace(/^\d+[、．.]\s*[（\(]\s*[√×]\s*[）\)]\s*/, '').trim();
    const isCorrect = judgmentMatch[2] === '√';
    
    judgmentQuestions.push({
      id: judgmentQuestions.length + 1,
      question: questionText,
      answer: isCorrect
    });
    continue;
  }
  
  const questionMatch = line.match(/^(\d+)[\.．.]\s*(.+)$/);
  if (questionMatch) {
    finalizeChoiceQuestion();
    currentQuestion = questionMatch[2];
    continue;
  }
  
  if (line.match(/^[A-D][、．.]/) || (line.match(/[A-D][、．.]/) && !line.match(/^答案/))) {
    const opts = parseOptionsFromLine(line);
    
    const hasAllOptions = ['A', 'B', 'C', 'D'].every(k => opts.some(o => o.key === k));
    
    if (hasAllOptions) {
      currentOptions = opts;
    } else if (opts.length >= 1) {
      for (const opt of opts) {
        const existingIndex = currentOptions.findIndex(o => o.key === opt.key);
        if (existingIndex === -1) {
          currentOptions.push(opt);
        }
      }
    }
    continue;
  }
  
  const answerMatch = line.match(/^答案[：:]\s*([A-D√×])/);
  if (answerMatch) {
    currentAnswer = answerMatch[1];
    continue;
  }
}

finalizeChoiceQuestion();

console.log(`选择题: ${choiceQuestions.length} 道`);
console.log(`判断题: ${judgmentQuestions.length} 道`);

const problemQuestions = [77, 78, 79, 80, 83, 173];
console.log(`\n检查问题题目：`);
problemQuestions.forEach(idx => {
  if (idx <= choiceQuestions.length) {
    const q = choiceQuestions[idx - 1];
    console.log(`\n第${q.id}题: ${q.question.substring(0, 35)}...`);
    console.log(`  选项数: ${q.options.length}`);
    q.options.forEach(o => console.log(`    ${o.key}: ${o.text}`));
    console.log(`  答案: ${q.answer}`);
  }
});

const result = {
  info: {
    title: "区块链技术考试题库",
    totalChoice: choiceQuestions.length,
    totalJudgment: judgmentQuestions.length
  },
  choiceQuestions,
  judgmentQuestions
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/exam-blockchain.json'),
  JSON.stringify(result, null, 2),
  'utf-8'
);

console.log(`\n文件已保存到 src/data/exam-blockchain.json`);
