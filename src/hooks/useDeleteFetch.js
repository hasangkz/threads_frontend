import { useState } from 'react';

const useDeleteFetch = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteData = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
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

  return { deleteData, loading, error };
};

export default useDeleteFetch;
