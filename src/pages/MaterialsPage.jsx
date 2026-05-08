import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../services/api';
import ReactMarkdown from 'react-markdown';

const TYPE_LABELS = {
  study_guide: { label: '学习指南', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  practice_guide: { label: '实操指南', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};
const DEFAULT_TYPE = { label: '资料', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

function TypeBadge({ type }) {
  const t = TYPE_LABELS[type] || DEFAULT_TYPE;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${t.bg} ${t.text} ${t.border}`}>
      {t.label}
    </span>
  );
}

function MaterialCard({ item, onExpand, isExpanded }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
      <button
        onClick={() => onExpand(item.id)}
        className="w-full text-left p-6 flex items-start gap-4"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
          {item.sort_order !== undefined ? item.sort_order + 1 : '#'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-800 truncate">{item.title}</h3>
            <TypeBadge type={item.type} />
          </div>
          {item.summary && (
            <p className="text-gray-500 text-sm line-clamp-2">{item.summary}</p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="mt-4 prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-li:text-gray-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-gray-900 prose-pre:text-gray-100">
            <ReactMarkdown>{item.content || ''}</ReactMarkdown>
          </div>
          {item.meta && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 className="text-sm font-semibold text-indigo-700 mb-2">附加信息</h4>
              <pre className="text-xs text-indigo-600 whitespace-pre-wrap font-mono">
                {JSON.stringify(item.meta, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MaterialsPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    get(`/subjects/${subjectId}`).then(setSubjectInfo).catch(() => {});
  }, [subjectId]);

  useEffect(() => {
    async function fetchMaterials() {
      setLoading(true);
      setError('');
      try {
        let allItems = [];
        let page = 1;
        const pageSize = 100;
        while (true) {
          const res = await get(`/subjects/${subjectId}/materials?page=${page}&pageSize=${pageSize}`);
          allItems = allItems.concat(res.items || []);
          if (allItems.length >= res.total) break;
          page++;
        }
        allItems.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setMaterials(allItems);
      } catch (err) {
        setError(err.message || '加载资料失败');
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, [subjectId]);

  const handleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-500 text-white py-8 px-4 shadow-lg">
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
          <h1 className="text-3xl font-bold mb-2">{subjectInfo?.name || '学习资料'}</h1>
          <p className="text-white/80">学习指南、实操步骤等参考资料</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all"
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && materials.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">暂无学习资料</p>
            <p className="text-gray-400 text-sm">资料可能尚未发布，请稍后再来查看</p>
          </div>
        )}

        {!loading && !error && materials.length > 0 && (
          <div className="space-y-4">
            {materials.map((item) => (
              <MaterialCard
                key={item.id}
                item={item}
                onExpand={handleExpand}
                isExpanded={expandedId === item.id}
              />
            ))}
          </div>
        )}

        <div className="text-center py-8">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white border-2 border-gray-200 hover:border-teal-400 hover:bg-teal-50 text-gray-700 hover:text-teal-600 rounded-xl transition-all shadow-md"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
