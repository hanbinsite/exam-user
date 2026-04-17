import { useParams, useNavigate } from 'react-router-dom';
import examData from '../data/exam-blockchain.json';
import learnData from '../data/learn-blockchain.json';
import practiceData from '../data/practice-blockchain.json';

function ChoiceLearnCard({ question, index }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed flex-1">{question.question}</p>
      </div>
      
      <div className="ml-14 space-y-3">
        {question.options.map((option) => (
          <div
            key={option.key}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              option.key === question.answer
                ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
              option.key === question.answer
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {option.key}
            </span>
            <span className={`flex-1 ${option.key === question.answer ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
              {option.text}
            </span>
            {option.key === question.answer && (
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function JudgmentLearnCard({ question, index }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg">
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium leading-relaxed flex-1">{question.question}</p>
      </div>
      
      <div className="ml-14 flex gap-4">
        <div className={`flex-1 py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-3 ${
          question.answer === true
            ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
            : 'border-gray-200 bg-gray-50 opacity-60'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            question.answer === true ? 'bg-green-500' : 'bg-gray-200'
          }`}>
            <svg className={`w-5 h-5 ${question.answer === true ? 'text-white' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className={`text-base font-medium ${question.answer === true ? 'text-green-800' : 'text-gray-500'}`}>正确</span>
          {question.answer === true && (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className={`flex-1 py-4 px-6 rounded-xl border-2 flex items-center justify-center gap-3 ${
          question.answer === false
            ? 'border-red-500 bg-gradient-to-r from-red-50 to-rose-50'
            : 'border-gray-200 bg-gray-50 opacity-60'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            question.answer === false ? 'bg-red-500' : 'bg-gray-200'
          }`}>
            <svg className={`w-5 h-5 ${question.answer === false ? 'text-white' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <span className={`text-base font-medium ${question.answer === false ? 'text-red-800' : 'text-gray-500'}`}>错误</span>
          {question.answer === false && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseAnalysisCard({ item, index }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
          {index + 1}
        </span>
        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
      </div>
      
      <div className="space-y-6">
        {item.sections.map((section, sIdx) => (
          <div key={sIdx} className="border-l-4 border-indigo-400 pl-4">
            <h4 className="text-lg font-semibold text-indigo-700 mb-3">{section.title}</h4>
            {section.content && (
              <p className="text-gray-600 mb-3">{section.content}</p>
            )}
            <div className="space-y-3">
              {section.items.map((itm, iIdx) => (
                <div key={iIdx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {iIdx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-gray-800">{itm.subtitle}：</span>
                      <span className="text-gray-600">{itm.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandBlock({ command, note }) {
  return (
    <div className="mt-2">
      <code className="bg-gray-900 text-green-400 px-3 py-1 rounded-lg text-sm font-mono">
        {command}
      </code>
      {note && <span className="ml-2 text-gray-500 text-sm">{note}</span>}
    </div>
  );
}

function StepItem({ step, index }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <span className="flex-shrink-0 w-7 h-7 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
        {step.step || index + 1}
      </span>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{step.action}</p>
        {step.detail && <p className="text-gray-600 text-sm mt-1">{step.detail}</p>}
        {step.command && <CommandBlock command={step.command} note={step.note} />}
        {step.commands && (
          <div className="mt-2 space-y-1">
            {step.commands.map((cmd, idx) => (
              <CommandBlock key={idx} command={cmd} />
            ))}
          </div>
        )}
        {step.example && (
          <p className="text-amber-600 text-sm mt-1">示例：{step.example}</p>
        )}
        {step.note && !step.command && (
          <p className="text-gray-500 text-sm mt-1">{step.note}</p>
        )}
      </div>
    </div>
  );
}

function SubTaskCard({ subTask }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        {subTask.name}
      </h5>
      {subTask.output && (
        <p className="text-orange-600 text-sm mb-2">输出文件：{subTask.output}</p>
      )}
      <div className="space-y-1">
        {subTask.steps.map((step, idx) => (
          <StepItem key={idx} step={step} index={idx} />
        ))}
      </div>
    </div>
  );
}

function PracticeCard({ task, index }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <span className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
              {task.type}
            </span>
          </div>
          <p className="text-gray-600">{task.description}</p>
        </div>
      </div>

      {task.sourcePath && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <span className="text-blue-700 font-medium">源码路径：</span>
          <code className="ml-2 text-blue-800">{task.sourcePath}</code>
        </div>
      )}

      {task.output && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <span className="text-green-700 font-medium">输出要求：</span>
          <span className="ml-2 text-green-800">{task.output}</span>
        </div>
      )}

      {task.preSteps && task.preSteps.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">准备步骤</h4>
          <div className="bg-amber-50 rounded-xl p-4">
            {task.preSteps.map((step, idx) => (
              <StepItem key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>
      )}

      {task.steps && task.steps.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">操作步骤</h4>
          <div className="rounded-xl p-4 bg-gray-50">
            {task.steps.map((step, idx) => (
              <StepItem key={idx} step={step} index={idx} />
            ))}
          </div>
        </div>
      )}

      {task.subTasks && task.subTasks.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">子任务</h4>
          {task.subTasks.map((subTask, idx) => (
            <SubTaskCard key={idx} subTask={subTask} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LearnPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const dataMap = {
    'blockchain': { exam: examData, learn: learnData, practice: practiceData },
  };

  const currentData = dataMap[examId];

  if (!currentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">学习资料不存在</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const currentExamData = currentData.exam;
  const currentLearnData = currentData.learn;
  const currentPracticeData = currentData.practice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-500 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </button>
          <h1 className="text-3xl font-bold mb-2">{currentExamData.info.title}</h1>
          <p className="text-white/80">
            选择题 {currentExamData.info.totalChoice} 道 | 判断题 {currentExamData.info.totalJudgment} 道 | 案例分析 {currentLearnData.info.totalCaseAnalysis} 道 | 实操 {currentPracticeData.info.totalPractice} 项
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentExamData.choiceQuestions && currentExamData.choiceQuestions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                选
              </span>
              <span>选择题答案</span>
              <span className="text-sm font-normal text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                {currentExamData.info.totalChoice} 题
              </span>
            </h2>
            {currentExamData.choiceQuestions.map((item, idx) => (
              <ChoiceLearnCard key={item.id} question={item} index={idx} />
            ))}
          </section>
        )}

        {currentExamData.judgmentQuestions && currentExamData.judgmentQuestions.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                判
              </span>
              <span>判断题答案</span>
              <span className="text-sm font-normal text-gray-500 bg-purple-100 px-3 py-1 rounded-full">
                {currentExamData.info.totalJudgment} 题
              </span>
            </h2>
            {currentExamData.judgmentQuestions.map((item, idx) => (
              <JudgmentLearnCard key={item.id} question={item} index={idx} />
            ))}
          </section>
        )}

        {currentLearnData.caseAnalysis && currentLearnData.caseAnalysis.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                案
              </span>
              <span>案例分析（重点）</span>
              <span className="text-sm font-normal text-gray-500 bg-orange-100 px-3 py-1 rounded-full">
                {currentLearnData.info.totalCaseAnalysis} 题
              </span>
            </h2>
            {currentLearnData.caseAnalysis.map((item, idx) => (
              <CaseAnalysisCard key={item.id} item={item} index={idx} />
            ))}
          </section>
        )}

        {currentPracticeData && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">
                实
              </span>
              <span>实操指南</span>
              <span className="text-sm font-normal text-gray-500 bg-amber-100 px-3 py-1 rounded-full">
                {currentPracticeData.info.totalPractice} 项
              </span>
            </h2>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">{currentPracticeData.baseSteps.title}</h3>
              </div>
              <p className="text-white/80 mb-4">{currentPracticeData.baseSteps.description}</p>
              <div className="bg-white/10 rounded-xl p-4">
                {currentPracticeData.baseSteps.steps.map((step, idx) => (
                  <StepItem key={idx} step={step} index={idx} />
                ))}
              </div>
            </div>

            {currentPracticeData.practiceTasks.map((task, idx) => (
              <PracticeCard key={task.id} task={task} index={idx} />
            ))}
          </section>
        )}

        <div className="text-center py-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-600 rounded-xl transition-all shadow-md"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
