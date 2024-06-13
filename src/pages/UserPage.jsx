import { useParams } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import useGetFetch from '../hooks/useGetFetch';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Badge, Box, Flex, Spinner, Text } from '@chakra-ui/react';
import postsAtom from '../atoms/postsAtom';
import useHandleToast from '../hooks/useHandleToast';
import useGetUserProfile from '../hooks/useGetUserProfile';
import userAtom from '../atoms/userAtom';
const UserPage = () => {
  const { loading, error, getData } = useGetFetch();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const { user, loading: userLoading } = useGetUserProfile(username);
  const handleToast = useHandleToast();
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getData(`/api/posts/user/${username}`);
      if (data) {
        setPosts(data?.posts);
      } else if (error) {
        handleToast('Error', error, 'error');
        return;
      }
    };

    if (user) {
      getPosts();
    }
  }, [username, error, handleToast, setPosts, user]);

  if ((!user && userLoading) || loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!user && !userLoading) {
    return (
      <Flex justifyContent={'center'}>
        <Text as='mark' fontSize={'xx-large'}>
          <h1>User not found</h1>
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <UserHeader user={user} />
      {posts?.length === 0 ? (
        <Flex justifyContent={'center'} mt={10}>
          {currentUser?._id === user._id ? (
            <>
              <Box maxW='sm' borderRadius='lg'>
                <Box display='flex' alignItems='baseline'>
                  <div borderRadius={10}>
                    <Badge borderRadius='10' p='2' colorScheme='teal'>
                      <Text fontSize={'l'}>Create new threads</Text>
                    </Badge>
                  </div>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Text as='mark' fontSize={'xx-large'}>
                <h1>User has not posts</h1>
              </Text>
            </>
          )}
        </Flex>
      ) : (
        <>
          {posts?.map((post) => (
            <UserPost
              posts={posts}
              setPosts={setPosts}
              key={post._id}
              post={post}
              postedBy={post.postedBy}
            />
          ))}
        </>
      )}
    </>
  );
};

export default UserPage;
