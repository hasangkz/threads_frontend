import { Button, Flex, Image, useColorMode } from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import useLogout from '../hooks/useLogout';
import userAtom from '../atoms/userAtom';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { LuMessageSquare } from 'react-icons/lu';
import { CgProfile } from 'react-icons/cg';
import { TiHome } from 'react-icons/ti';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const authScreen = useRecoilValue(authScreenAtom);

  const handleLogout = (e) => {
    e.preventDefault();

    logout();
  };

  const handleAuthValue = () => {
    if (authScreen === 'signup') {
      setAuthScreen('login');
    } else {
      setAuthScreen('signup');
    }
  };

  return (
    <Flex justifyContent={'space-between'} mt={6} mb='12'>
      {user && (
        <Link as={RouterLink} to='/'>
          <TiHome size={30} />
        </Link>
      )}
      {!user && (
        <Link as={RouterLink} to={'/auth'} onClick={handleAuthValue}>
          <Button color={'green.700'} fontSize={'medium'}>
            {authScreen === 'signup' ? 'Login' : 'Sign up'}
          </Button>
        </Link>
      )}

      <Image
        cursor={'pointer'}
        alt='logo'
        w={10}
        src={colorMode === 'dark' ? '/light-logo.png' : '/dark-logo.png'}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={'center'} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <CgProfile size={30} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <LuMessageSquare size={30} />
          </Link>
          {/* <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={30} />
          </Link> */}
          <Button size={'xs'} onClick={handleLogout}>
            <FiLogOut size={30} />
          </Button>
        </Flex>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={'https://github.com/hasangkz'}
          onClick={() => setAuthScreen('signup')}
        >
          <Button color={'green.700'} fontSize={'medium'}>
            Who Am I ??
          </Button>
        </Link>
      )}
    </Flex>
  );
};

export default Header;
