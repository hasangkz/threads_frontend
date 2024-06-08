import { Avatar, Box, Divider, Flex, Image, Text } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from '../components/Actions';
import { useState } from 'react';
import Comment from '../components/Comment';

const PostPage = () => {
  const [liked, setLiked] = useState(false);

  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src='zuck-avatar.png' size={'md'} name='avatar' />

          <Flex justifyItems={'center'} alignItems={'center'}>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              mark
            </Text>
            <Image src='/verified.png' w={4} h={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'sm'} color={'gray.light'}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Box my={5}>
        <Text fontSize={'sm'}>
          gençler selamın aleykummm ben geldimgençler selamın aleykummm ben
          geldimgençler selamın aleykummm ben geldimgençler selamın aleykummm
          ben geldim
        </Text>
      </Box>

      <Box borderRadius={'5'} overflow={'hidden'} border={'1px solid #555'}>
        <Image src={'/zuck-avatar.png'} w={'full'} />
      </Box>

      <Flex gap={3} my={1}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize='sm'>
          232 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize='sm'>
          422 likes
        </Text>
      </Flex>
      <Divider my={4} />
      <Comment
        comment='hahaahah LOL!'
        createdAt='2d'
        likes={100}
        username={'johny'}
        userAvatar={'https://bit.ly/sage-adebayo'}
      />
      <Comment comment='anan' createdAt='1d' likes={2} username={'ahmet'} />
    </>
  );
};

export default PostPage;
