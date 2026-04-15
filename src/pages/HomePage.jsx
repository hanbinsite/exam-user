import { Link } from 'react-router-dom';
import examData from '../data/exam-blockchain.json';

const examList = [
  {
    id: 'blockchain',
    title: '区块链技术考试题库',
    description: '包含区块链基础知识、智能合约、以太坊等相关内容',
    data: examData,
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
          <p className="text-gray-600 text-lg">选择题库开始答题，支持自动保存答题进度</p>
        </div>

        <div className="grid gap-6">
          {examList.map((exam) => (
            <Link
              key={exam.id}
              to={`/exam/${exam.id}`}
              className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 flex items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                  {exam.title.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                    {exam.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-2">{exam.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 text-blue-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {exam.data.info.totalChoice} 道选择题
                    </span>
                    <span className="inline-flex items-center gap-1 text-purple-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {exam.data.info.totalJudgment} 道判断题
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>答题进度自动保存至本地浏览器</p>
          <p className="mt-1">支持多套题库，可扩展添加更多题目</p>
        </div>
      </div>
    </div>
  );
}
