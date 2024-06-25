import { Avatar } from '@chakra-ui/avatar';
import { Image } from '@chakra-ui/image';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Link, useNavigate } from 'react-router-dom';
import Actions from './Actions';
import React, { useEffect, useState } from 'react';
import useHandleToast from '../hooks/useHandleToast';
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useGetFetch from '../hooks/useGetFetch';
import { Button, Spinner, useDisclosure } from '@chakra-ui/react';
import useDeleteFetch from '../hooks/useDeleteFetch';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

const UserPost = ({ post, postedBy, posts, setPosts }) => {
  const { loading, error, getData } = useGetFetch();
  const {
    loading: deleteLoading,
    error: deleteError,
    deleteData,
  } = useDeleteFetch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const handleToast = useHandleToast();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const cancelRef = React.useRef();

  useEffect(() => {
    const getUser = async () => {
      const data = await getData('/api/users/profile/' + postedBy);
      if (data) {
        setUser(data?.user);
      } else if (error) {
        handleToast('Error', error, 'error');
        setUser(null);
        return;
      }
    };

    getUser();
  }, [setUser, postedBy, handleToast, error]);

  const handleDeletePost = async (e) => {
    onClose();
    try {
      const data = await deleteData(`/api/posts/${post?._id}`);

      if (data) {
        handleToast('Success', 'Post deleted succesfully!', 'success');
        setPosts(posts.filter((p) => p?._id !== post?._id));
      } else if (deleteError) {
        handleToast('Error', deleteError, 'error');
      }
    } catch (error) {
      handleToast('Error', error.message, 'error');
    }
  };

  if (!user && (loading || deleteLoading)) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!user && (!loading || !deleteLoading)) {
    return (
      <Flex justifyContent={'center'}>
        <Text as='mark' fontSize={'xx-large'}>
          <h1>Not found!</h1>
        </Text>
      </Flex>
    );
  }

  const handleAlert = (e) => {
    e.preventDefault();
    onOpen();
  };

  return (
    <>
      <Link to={`/${user.username}/post/${post?._id}`}>
        <Flex gap={3} mb={14}>
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Avatar
              size='md'
              name={user.name}
              src={user?.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            {currentUser && post?.replies?.length > 0 && (
              <>
                <Box w='1px' h={'full'} bg='gray.light' my={2}></Box>
                <Box position={'relative'} w={'full'}>
                  {post?.replies[0] && (
                    <Avatar
                      size='xs'
                      name='User'
                      src={post?.replies[0].userProfilePic}
                      position={'absolute'}
                      top={'0px'}
                      left='12px'
                      padding={'2px'}
                    />
                  )}

                  {post?.replies[1] && (
                    <Avatar
                      size='xs'
                      name='User'
                      src={post?.replies[1].userProfilePic}
                      position={'absolute'}
                      bottom={'0px'}
                      right='-5px'
                      padding={'2px'}
                    />
                  )}

                  {post?.replies[2] && (
                    <Avatar
                      size='xs'
                      name='User'
                      src={post?.replies[2].userProfilePic}
                      position={'absolute'}
                      bottom={'0px'}
                      left='-5px'
                      padding={'2px'}
                    />
                  )}
                </Box>
              </>
            )}
          </Flex>
          <Flex flex={1} flexDirection={'column'} gap={2}>
            <Flex justifyContent={'space-between'} w={'full'}>
              <Flex w={'full'} alignItems={'center'}>
                <Text
                  fontSize={'sm'}
                  fontWeight={'bold'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user?.username}`);
                  }}
                >
                  {user?.username}
                </Text>
              </Flex>
              <Flex gap={4} alignItems={'center'}>
                <Text
                  fontSize={'xs'}
                  width={36}
                  textAlign={'right'}
                  color={'gray.light'}
                >
                  {formatDistanceToNow(new Date(post?.createdAt))} ago
                </Text>

                {currentUser?._id === user?._id && (
                  <DeleteIcon size={20} onClick={handleAlert} />
                )}
              </Flex>
            </Flex>

            <Text fontSize={'sm'}>{post?.text}</Text>
            {post?.img && (
              <Box
                borderRadius={6}
                overflow={'hidden'}
                border={'1px solid'}
                borderColor={'gray.light'}
              >
                <Image src={post?.img} w={'full'} />
              </Box>
            )}

            {currentUser && (
              <Flex gap={3} my={1}>
                <Actions post={post} />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Link>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent backgroundColor={'black'} color={'white'}>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Thread
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete the thread?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDeletePost} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UserPost;
