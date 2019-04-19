import { useEffect, useState } from 'react';

export function usePromise (promiseFunc, initialVal, onError) {
  const [data, setData] = useState(initialVal);
  const [loading, setLoading] = useState(false);
  let cancelled = false;

  useEffect(() =>
    () => {
      cancelled = true;
    }, []);

  async function exec (...params) {
    if (loading) {
      if (onError) {
        onError(new Error('usePromise can only be called while it\'s idle'));
      }
      return;
    }

    setLoading(true);

    promiseFunc(...params).then(result => {
      if (!cancelled) {
        setLoading(false);
        setData(result);
      }
    }).catch(error => {
      if (!cancelled) {
        setLoading(false);
        if (onError) {
          onError(error);
        }
      }
    });
  }

  return [data, loading, exec];
}
