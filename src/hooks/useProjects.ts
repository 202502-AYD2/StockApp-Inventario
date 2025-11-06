import { useEffect, useState } from 'react';
import { getProjects } from '@/utils/api';

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch projects' + err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  return { projects, loading, error, refetch: fetchProjects };
};
