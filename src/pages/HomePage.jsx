import { Link } from 'react-router-dom';
import examData from '../data/exam-blockchain.json';
import learnData from '../data/learn-blockchain.json';
import practiceData from '../data/practice-blockchain.json';

const examList = [
  {
    id: 'blockchain',
    title: '区块链技术',
    description: '包含区块链基础知识、智能合约、以太坊等相关内容',
    examData: examData,
    learnData: learnData,
    practiceData: practiceData,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            在线考试系统
          </h1>
          <p className="text-gray-600 text-lg">先学习再考试，支持自动保存答题进度</p>
        </div>

        <div className="grid gap-6">
          {examList.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                    {exam.title.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      {exam.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-2">{exam.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-blue-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {exam.examData.info.totalChoice} 道选择题
                      </span>
                      <span className="inline-flex items-center gap-1 text-purple-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {exam.examData.info.totalJudgment} 道判断题
                      </span>
                      <span className="inline-flex items-center gap-1 text-orange-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        {exam.learnData.info.totalCaseAnalysis} 道案例分析
                      </span>
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        {exam.practiceData.info.totalPractice} 项实操
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex">
                <Link
                  to={`/learn/${exam.id}`}
                  className="flex-1 p-4 text-center bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-r border-gray-100 transition-all group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    <span className="font-semibold text-green-700 group-hover:text-green-800">学习模式</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">答案、案例分析、实操指南</p>
                </Link>
                
                <Link
                  to={`/exam/${exam.id}`}
                  className="flex-1 p-4 text-center bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-indigo-700 group-hover:text-indigo-800">考试模式</span>
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">在线答题，自动评分</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>答题进度自动保存至本地浏览器</p>
          <p className="mt-1">建议先学习再考试，效果更佳</p>
        </div>
      </div>
    </div>
  );
}
