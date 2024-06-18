import { useEffect, useState } from 'react';
import useHandleToast from './useHandleToast';
import { useParams } from 'react-router-dom';

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleToast = useHandleToast();
  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, {
          method: 'GET',
        });
        const result = await res.json();
        if (result.error) {
          handleToast('Error', result.error, 'error');
          return;
        }
        if (result?.user?.isFrozen) {
          setUser(null);
          return;
        }
        setUser(result?.user);
      } catch (error) {
        handleToast('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, handleToast]);

  return { loading, user };
};

export default useGetUserProfile;
