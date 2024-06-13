import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import useFollow from '../hooks/useFollow';
import useUnFollow from '../hooks/useUnFollow';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useHandleToast from '../hooks/useHandleToast';

const SuggestedUser = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const handleToast = useHandleToast();
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

      <Button
        size={'sm'}
        color={following ? 'black' : 'white'}
        bg={following ? 'pink' : 'teal'}
        onClick={following ? handleUnFollow : handleFollow}
        isLoading={loading || unfollowLoading}
        _hover={{
          color: following ? 'black' : 'white',
          opacity: '.6',
        }}
      >
        {following ? 'Unfollow' : 'Follow'}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
