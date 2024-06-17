import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import authScreenAtom from '../atoms/authAtom';
import useHandleToast from '../hooks/useHandleToast';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import { useState } from 'react';
import usePostFetch from '../hooks/usePostFetch';
import userAtom from '../atoms/userAtom';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const handleToast = useHandleToast();
  const [input, setInput] = useState({
    name: null,
    username: null,
    email: null,
    password: null,
  });
  const { loading, error, postData } = usePostFetch();

  let disabled =
    !input?.email || !input?.name || !input?.username || !input?.password;

  const handleSignup = async () => {
    const data = await postData('/api/users/signup', input);

    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      handleToast('Success', 'Welcome to Threads!', 'success');
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
            Please Join Us!
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          boxShadow={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          p={10}
          w={{
            base: 'full',
            sm: '400px',
          }}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input
                    required={true}
                    isRequired={true}
                    type='text'
                    onChange={(e) =>
                      setInput({ ...input, name: e.target.value })
                    }
                    value={input.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    required={true}
                    isRequired={true}
                    type='text'
                    onChange={(e) =>
                      setInput({ ...input, username: e.target.value })
                    }
                    value={input.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                placeholder='your-email@example.com'
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                value={input.email}
                required={true}
                isRequired={true}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  required={true}
                  isRequired={true}
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) =>
                    setInput({ ...input, password: e.target.value })
                  }
                  value={input.password}
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
            {loading ? (
              <>
                <Flex justifyContent={'center'}>
                  <Spinner size={'xl'} />
                </Flex>
              </>
            ) : (
              <>
                <Stack spacing={10} pt={2}>
                  <Button
                    loadingText='Submitting'
                    isDisabled={disabled}
                    size='lg'
                    bg={
                      disabled
                        ? // eslint-disable-next-line react-hooks/rules-of-hooks
                          useColorModeValue('gray.600', 'gray.700')
                        : // eslint-disable-next-line react-hooks/rules-of-hooks
                          useColorModeValue('green.700', 'green.800')
                    }
                    color={'white'}
                    _hover={{
                      bg: disabled
                        ? // eslint-disable-next-line react-hooks/rules-of-hooks
                          useColorModeValue('gray.500', 'black.600')
                        : // eslint-disable-next-line react-hooks/rules-of-hooks
                          useColorModeValue('green.500', 'green.600'),
                    }}
                    onClick={handleSignup}
                  >
                    Sign up
                  </Button>
                </Stack>
              </>
            )}

            <Stack pt={6}>
              <Text fontSize={'x-large'} align={'center'}>
                Already have a account?
                <br />
                <Link onClick={() => setAuthScreen('login')}>
                  <Button color={'green.600'} size='lg'>
                    Login
                  </Button>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
