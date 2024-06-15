import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { RiShareForwardLine } from 'react-icons/ri';
import useHandleToast from '../hooks/useHandleToast';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { Link as RouterLink } from 'react-router-dom';
import useFollow from '../hooks/useFollow';
import React, { useState } from 'react';
import useUnFollow from '../hooks/useUnFollow';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import '../index.css';
import UserFollowers from './UserFollowers';
import UserFollowings from './UserFollowings';

const UserHeader = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const handleToast = useHandleToast();
  const currentUser = useRecoilValue(userAtom);
  const { loading, error, follow } = useFollow();
  const {
    loading: unfollowLoading,
    error: unfollowError,
    unFollow,
  } = useUnFollow();

  const [following, setFollowing] = useState(
    user?.followers?.includes(currentUser?._id)
  );

  const handleFollow = async (e) => {
    e.preventDefault();

    const data = await follow(`/api/users/follow/${user._id}`);
    if (data?.message) {
      setFollowing(!following);
      user?.followers?.push(currentUser?._id);

      handleToast('Success', data?.message, 'success');
    } else if (error) {
      handleToast('Error', error, 'error');
      return;
    }
  };

  const handleUnFollow = async (e) => {
    e.preventDefault();

    const data = await unFollow(`/api/users/unfollow/${user._id}`);
    if (data?.message) {
      setFollowing(!following);
      user?.followers?.pop();

      handleToast('Success', data?.message, 'success');
    } else if (unfollowError) {
      handleToast('Error', error, 'error');
      return;
    }
  };

  const handleFreezeAccount = () => {
    onClose();
    console.log('tıkladı');
  };

  const handleCopyUser = () => {
    const currentUserProfileURL = window.location.href;
    navigator.clipboard.writeText(currentUserProfileURL);

    handleToast('Success', 'Profile address copied successfully', 'success');
  };

  return (
    <>
      <VStack gap={4} align='start'>
        <Flex justifyContent={'space-between'} w={'full'}>
          <Box>
            <Text fontSize={'2xl'} fontWeight={'bold'}>
              {user?.name}
            </Text>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'sm'}>{user?.username}</Text>
            </Flex>
          </Box>
          <Box>
            {user?.profilePic && (
              <Avatar
                name={user?.name}
                src={user?.profilePic}
                size={{
                  base: 'md',
                  md: 'xl',
                }}
              />
            )}
            {!user.profilePic && (
              <Avatar
                name={user?.name}
                size={{
                  base: 'md',
                  md: 'xl',
                }}
              />
            )}
          </Box>
        </Flex>

        <Box w='100%'>
          <Text>{user?.bio}</Text>
        </Box>

        {currentUser?._id === user._id && (
          <Flex justifyContent={'space-between'} w={'full'}>
            <Link as={RouterLink} to='/update'>
              <Button colorScheme='teal' variant='solid' size={'sm'}>
                Update Profile
              </Button>
            </Link>
            <Button
              colorScheme='blue'
              variant='ghost'
              size={'sm'}
              onClick={onOpen}
            >
              Freeze Account
            </Button>
          </Flex>
        )}

        {currentUser && currentUser?._id !== user._id && (
          <Button
            size={'sm'}
            colorScheme={following ? 'pink' : 'teal'}
            variant='solid'
            onClick={following ? handleUnFollow : handleFollow}
            isLoading={loading || unfollowLoading}
          >
            {following ? 'Unfollow' : 'Follow'}
          </Button>
        )}

        <Flex w={'full'} justifyContent={'space-between'}>
          <Flex gap={2} alignItems={'center'}>
            <UserFollowers user={user} />
            <Text
              justifyContent={'center'}
              color={'gray.black'}
              fontSize={'xl'}
            >
              |
            </Text>
            <UserFollowings user={user} />
          </Flex>

          <Flex>
            <Box className='icon-container'>
              <BsInstagram size={24} cursor={'pointer'} />
            </Box>
            <Box className='icon-container' onClick={handleCopyUser}>
              <RiShareForwardLine size={24} cursor={'pointer'} />
            </Box>
          </Flex>
        </Flex>

        <Flex justifyContent={'space-between'} w={'full'}>
          <Flex
            flex={1}
            borderBottom={'1px solid white'}
            justifyContent={'center'}
            pb={4}
            cursor={'pointer'}
          >
            <Text fontWeight={'bold'}>Threads</Text>
          </Flex>

          <Flex
            flex={1}
            borderBottom={'1px solid white'}
            justifyContent={'center'}
            pb={4}
            cursor={'pointer'}
          >
            <Text fontWeight={'bold'}>Replies</Text>
          </Flex>
        </Flex>
      </VStack>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent background={'black'} color={'white'}>
          <AlertDialogHeader>
            Do you want to freeze your account?
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            All you have to do is log in to activate your account.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme='red' ml={3} onClick={handleFreezeAccount}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserHeader;
