import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Actions from '../components/Actions';
import { useEffect } from 'react';
import useHandleToast from '../hooks/useHandleToast';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import useGetFetch from '../hooks/useGetFetch';
import useGetUserProfile from '../hooks/useGetUserProfile';
import Comment from '../components/Comment';

const PostDetailPage = () => {
  const { postID } = useParams();
  const { loading, error, getData } = useGetFetch();
  const { user, loading: userLoading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const post = posts?.[0];
  const handleToast = useHandleToast();

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const data = await getData(`/api/posts/${postID}`);
        if (data) {
          console.log('data', data);
          setPosts([data?.post]);
        } else if (error) {
          handleToast('Error', error, 'error');
          return;
        }
      } catch (error) {
        handleToast('Error', error.message, 'error');
      }
    };
    getPost();
  }, [handleToast, postID, setPosts, user]);

  if (loading || userLoading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user?.profilePic} size={'md'} name='Mark Zuckerberg' />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {user?.username}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text
            fontSize={'xs'}
            width={36}
            textAlign={'right'}
            color={'gray.light'}
          >
            {post?.createdAt && formatDistanceToNow(new Date(post?.createdAt))}{' '}
            ago
          </Text>
        </Flex>
      </Flex>

      <Text my={3}>{post?.text}</Text>

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

      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      <Divider my={4} />
      {post?.replies?.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === post?.replies[post?.replies.length - 1]._id}
        />
      ))}
    </>
  );
};

export default PostDetailPage;
