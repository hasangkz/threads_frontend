import { Avatar, Box, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Actions from './Actions';
import { useState } from 'react';

const UserPost = ({ postImage, postTitle, replies, likes }) => {
  const [liked, setLiked] = useState(false);

  return (
    <VStack align='stretch' spacing={4}>
      <Flex gap={4} mb={4} py={4}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar name={'avatar'} src='/zuck-avatar.png' size={'md'} />
          <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>

          <Box w={'full'} position={'relative'}>
            <Avatar
              name={'avatar'}
              src='/zuck-avatar.png'
              position={'absolute'}
              size={'xs'}
              top={'0px'}
              left={'12px'}
              padding={'1px'}
            />
            <Avatar
              name={'avatar'}
              src='/zuck-avatar.png'
              position={'absolute'}
              size={'xs'}
              bottom={'0px'}
              right={'-5px'}
              padding={'1px'}
            />
            <Avatar
              name={'avatar'}
              src='/zuck-avatar.png'
              position={'absolute'}
              size={'xs'}
              bottom={'0px'}
              left={'-5px'}
              padding={'1px'}
            />
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Link to={'/hasan/post/1'}>
            <Flex justifyContent={'space-between'} w={'full'}>
              <Flex w={'full'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>
                  hasangkz
                </Text>

                <Image src='/verified.png' w={4} />
              </Flex>

              <Flex gap={4} alignItems={'center'}>
                <Text fontSize={'sm'} color={'gray.light'}>
                  1d
                </Text>
                <BsThreeDots />
              </Flex>
            </Flex>

            <Box>
              <Text fontSize={'sm'}>{postTitle}</Text>
            </Box>

            {postImage && (
              <Box
                borderRadius={'5'}
                overflow={'hidden'}
                border={'1px solid #555'}
              >
                <Image src={postImage} w={'full'} />
              </Box>
            )}
          </Link>

          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked} />
          </Flex>

          <Flex gap={2} alignItems={'center'}>
            <Text color={'gray.light'} fontSize='sm'>
              {replies} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
            <Text color={'gray.light'} fontSize='sm'>
              {likes} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserPost;
