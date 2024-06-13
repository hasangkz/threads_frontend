import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useHandleToast from '../hooks/useHandleToast';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import UserPost from '../components/UserPost';
import useGetFetch from '../hooks/useGetFetch';
import Suggest from '../components/Suggest';
const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const handleToast = useHandleToast();
  const { loading, error, getData } = useGetFetch();

  useEffect(() => {
    const getFeedPosts = async () => {
      const data = await getData('/api/posts/feed');
      if (data) {
        setPosts(data?.feedPosts);
      } else if (error) {
        handleToast('Error', error, 'error');
        setPosts(null);
        return;
      }
    };

    getFeedPosts();
  }, [handleToast, setPosts]);

  if (loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!loading && posts?.length === 0) {
    return (
      <Flex justifyContent={'center'} fontSize={'x-large'}>
        <Text as='mark'>Follow some users to see the feed </Text>
      </Flex>
    );
  }

  return (
    <Flex gap='10' alignItems={'flex-start'}>
      <Box flex={70}>
        {posts?.map((post) => (
          <UserPost key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box
        flex={30}
        display={{
          base: 'none',
          md: 'block',
        }}
      >
        <Suggest />
      </Box>
    </Flex>
  );
};

export default HomePage;
