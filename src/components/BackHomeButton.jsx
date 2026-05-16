import { useNavigate } from 'react-router-dom';

const HOVER_MAP = {
  indigo: 'hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600',
  teal: 'hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600',
  orange: 'hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600',
};

export default function BackHomeButton({ color = 'indigo' }) {
  const navigate = useNavigate();
  return (
    <div className="text-center py-8">
      <button
        onClick={() => navigate('/')}
        className={`px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl transition-all shadow-md ${HOVER_MAP[color] || HOVER_MAP.indigo}`}
      >
        返回首页
      </button>
    </div>
  );
}
