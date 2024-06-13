import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useHandleToast from '../hooks/useHandleToast';
import useHandleImage from '../hooks/useHandleImage';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import usePutFetch from '../hooks/usePutFetch';

const UpdatePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [input, setInput] = useState({
    name: user.name,
    username: user.username,
    img: user.img,
    email: user.email,
    bio: user.bio,
    password: '',
  });

  const fileRef = useRef(null);
  const { handleImageChange, imgUrl } = useHandleImage();

  const handleToast = useHandleToast();

  const { loading, error, postData } = usePutFetch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await postData(`/api/users/update/${user._id}`, {
      ...input,
      profilePic: imgUrl,
    });

    if (data) {
      localStorage.setItem('user', JSON.stringify(data?.user));
      setUser(data?.user);
      handleToast('Success', data?.message, 'success');
    } else if (error) {
      handleToast('Error', error, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'} my={6}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            Edit your profile
          </Heading>
          <FormControl id='userName'>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar
                  size='xl'
                  boxShadow={'md'}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w='full'>
                <Button w='full' onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type='file'
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder='John Doe'
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type='text'
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder='johndoe'
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type='text'
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder='your-email@example.com'
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type='email'
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder='About yourself...'
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type='text'
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder='********'
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type='password'
            />
          </FormControl>
          {loading ? (
            <>
              <Flex justifyContent={'center'}>
                <Spinner size={'xl'} />
              </Flex>
            </>
          ) : (
            <>
              <Stack spacing={6} direction={['column', 'row']}>
                <Link as={RouterLink} to={`/`}>
                  <Button
                    bg={'red.600'}
                    color={'white'}
                    w='full'
                    _hover={{
                      bg: 'red.700',
                    }}
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  bg={'green.700'}
                  color={'white'}
                  w='full'
                  _hover={{
                    bg: 'green.800',
                  }}
                  type='submit'
                  isLoading={loading}
                >
                  Save
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdatePage;
