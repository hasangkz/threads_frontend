import { useEffect, useState } from 'react';
import useGetFetch from '../hooks/useGetFetch';
import useHandleToast from '../hooks/useHandleToast';
import { Avatar, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import useUnFollow from '../hooks/useUnFollow';
import useFollow from '../hooks/useFollow';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link } from 'react-router-dom';

const UserFollowing = ({ userID }) => {
  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const handleToast = useHandleToast();
  const { loading: getLoading, error: getError, getData } = useGetFetch();
  const { loading: followLoading, error: followError, follow } = useFollow();
  const {
    loading: unfollowLoading,
    error: unfollowError,
    unFollow,
  } = useUnFollow();

  const [following, setFollowing] = useState(
    user?.followers?.includes(currentUser?._id)
  );

  console.log('currents', currentUser);
  useEffect(() => {
    const getUser = async () => {
      const data = await getData(`/api/users/${userID}`);
      if (data) {
        setUser(data?.user);
      } else if (getError) {
        handleToast('Error', getError, 'error');
        return;
      }
    };

    getUser();
  }, [handleToast, userID]);

  const handleFollow = async () => {
    const data = await follow(`/api/users/follow/${user?._id}`);
    if (data?.message) {
      setFollowing(!following);
      user?.followers?.push(currentUser?._id);
      handleToast('Success', data?.message, 'success');
    } else if (followError) {
      handleToast('Error', followError, 'error');
      return;
    }
  };

  const handleUnFollow = async () => {
    const data = await unFollow(`/api/users/unfollow/${user?._id}`);
    if (data?.message) {
      setFollowing(!following);
      user?.followers?.pop();
      handleToast('Success', data?.message, 'success');
    } else if (unfollowError) {
      handleToast('Error', unfollowError, 'error');
      return;
    }
  };

  if (getLoading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  return (
    <Flex gap={2} justifyContent={'space-between'} alignItems={'center'}>
      <Flex gap={2} as={Link} to={`${user?.username}`}>
        <Avatar src={user?.profilePic} />
        <Box>
          <Text fontSize={'sm'} fontWeight={'bold'}>
            {user?.username}
          </Text>
          <Text color={'gray.light'} fontSize={'sm'}>
            {user?.name}
          </Text>
        </Box>
      </Flex>

      {user?._id === currentUser?._id ? (
        <></>
      ) : (
        <>
          <Button
            size={'sm'}
            color={following ? 'black' : 'white'}
            bg={following ? 'pink' : 'teal'}
            onClick={following ? handleUnFollow : handleFollow}
            isLoading={followLoading || getLoading || unfollowLoading}
            _hover={{
              color: following ? 'black' : 'white',
              opacity: '.6',
            }}
          >
            {following ? 'Unfollow' : 'Follow'}
          </Button>
        </>
      )}
    </Flex>
  );
};

export default UserFollowing;
