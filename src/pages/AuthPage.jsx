import { useRecoilValue } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import Login from '../components/Login';
import Signup from '../components/Signup';

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);

  return <>{authScreenState === 'a' ? <Login /> : <Signup />}</>;
};

export default AuthPage;
