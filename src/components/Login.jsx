import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import useHandleToast from '../hooks/useHandleToast';
import userAtom from '../atoms/userAtom';
import usePostFetch from '../hooks/usePostFetch';

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [input, setInput] = useState({
    username: '',
    password: '',
  });

  let disabled = !input?.username || !input?.password;

  const { loading, error, postData } = usePostFetch();

  const handleToast = useHandleToast();
  const handleLogin = async () => {
    const data = await postData('/api/users/login', input);

    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      handleToast('Success', 'Welcome back to Threads!', 'success');
    } else if (error) {
      handleToast('Error', error, 'error');
      return;
    }
  };

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Welcome!
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'dark-lg'}
          p={10}
          w={{
            base: 'full',
            sm: '400px',
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired={true}>
              <FormLabel>Username</FormLabel>
              <Input
                required={true}
                type='text'
                value={input.username}
                onChange={(e) =>
                  setInput((input) => ({
                    ...input,
                    username: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl isRequired={true}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  required={true}
                  type={showPassword ? 'text' : 'password'}
                  value={input.password}
                  onChange={(e) =>
                    setInput((input) => ({
                      ...input,
                      password: e.target.value,
                    }))
                  }
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              {loading ? (
                <>
                  <Flex justifyContent={'center'}>
                    <Spinner size={'xl'} />
                  </Flex>
                </>
              ) : (
                <>
                  <Button
                    loadingText='Logging in'
                    size='lg'
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    bg={useColorModeValue('gray.600', 'gray.700')}
                    color={'white'}
                    _hover={{
                      // eslint-disable-next-line react-hooks/rules-of-hooks
                      bg: useColorModeValue('green.700', 'green.800'),
                    }}
                    onClick={handleLogin}
                    isLoading={loading}
                    isDisabled={disabled}
                  >
                    Login
                  </Button>
                </>
              )}
            </Stack>
            <Stack pt={6}>
              <Text fontSize={'x-large'} align={'center'}>
                Don&apos;t have an account?
                <br />
                <Link onClick={() => setAuthScreen('signup')}>
                  <Button color={'green.600'} size='lg'>
                    Create an account
                  </Button>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
