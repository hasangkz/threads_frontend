import {
  AbsoluteCenter,
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Message from './Message';
import MessageInput from './MessageInput';
import { useEffect, useRef, useState } from 'react';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useHandleToast from '../hooks/useHandleToast.js';
import useGetFetch from '../hooks/useGetFetch';

const MessageContainer = () => {
  const { loading, error, getData } = useGetFetch();
  const [messages, setMessages] = useState([]);
  const handleToast = useHandleToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      if (selectedConversation?.mock) return;
      const data = await getData(
        `/api/messages/${selectedConversation?.userId}`
      );
      console.log('data', data);
      if (data && data?.messages) {
        setMessages(data?.messages);
      } else if (error) {
        handleToast('Error', error, 'error');
        return;
      }
    };

    getMessages();
  }, [handleToast, setMessages, selectedConversation?.userId]);

  return (
    <Flex
      flex='70'
      bg={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'md'}
      p={2}
      flexDirection={'column'}
    >
      {/* Message header */}
      <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
        <Avatar src={selectedConversation?.userProfilePic} size={'sm'} />
        <Text display={'flex'} alignItems={'center'}>
          {selectedConversation?.username}
        </Text>
      </Flex>

      <Box position='relative' padding='2'>
        <Divider backgroundColor={'green !important'} />
      </Box>

      <Flex
        flexDir={'column'}
        gap={4}
        my={4}
        p={2}
        height={'400px'}
        overflowY={'auto'}
      >
        {loading ? (
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={'center'}
              p={1}
              borderRadius={'md'}
              alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={'column'} gap={2}>
                <Skeleton h='8px' w='250px' />
                <Skeleton h='8px' w='250px' />
                <Skeleton h='8px' w='250px' />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))
        ) : (
          <>
            {messages?.map((message) => (
              <Flex key={message?._id} direction={'column'}>
                <Message
                  message={message}
                  ownMessage={currentUser?._id === message?.sender}
                />
              </Flex>
            ))}
          </>
        )}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
