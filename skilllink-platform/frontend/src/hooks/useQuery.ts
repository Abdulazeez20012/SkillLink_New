import { useState, useEffect } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useQuery<T>(queryFn: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await queryFn();
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ data: null, loading: false, error: error as Error });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  const refetch = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const data = await queryFn();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as Error }));
    }
  };

  return { ...state, refetch };
}
