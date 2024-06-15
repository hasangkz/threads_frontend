import { useState } from 'react';

const useGetFetch = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      const result = await response.json();
      if (result?.error) {
        throw new Error(result?.error);
      }
      return result;
    } catch (error) {
      setError(error?.message || error?.error);
    } finally {
      setLoading(false);
    }
  };

  return { getData, loading, error };
};

export default useGetFetch;
