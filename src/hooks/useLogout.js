import userAtom from '../atoms/userAtom';
import { useSetRecoilState } from 'recoil';
import useHandleToast from './useHandleToast';
import usePostFetch from './usePostFetch';

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const handleToast = useHandleToast();
  const { error, postData } = usePostFetch();

  const logout = async () => {
    const data = await postData('/api/users/logout');

    if (data) {
      localStorage.removeItem('user');
      setUser(null);
      handleToast('Success', 'Successfully logged out!', 'success');
    } else if (error) {
      handleToast('Error', error, 'error');
    }
  };

  return logout;
};

export default useLogout;
