import { useState } from 'react';

const usePutFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, input) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: input ? JSON.stringify(input) : undefined,
      });
      const result = await response.json();
      if (result?.error) {
        throw new Error(result?.error);
      }
      return result;
    } catch (err) {
      setError(err?.message || err?.error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, postData };
};

export default usePutFetch;
