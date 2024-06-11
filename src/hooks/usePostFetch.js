import { useState } from 'react';

const usePostFetch = (url, input) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
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

export default usePostFetch;
