import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/subject/${examId}?mode=study`, { replace: true });
  }, [examId, navigate]);

  return null;
}
