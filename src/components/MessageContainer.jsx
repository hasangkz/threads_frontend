import {
  Avatar,
  Box,
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
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useHandleToast from '../hooks/useHandleToast.js';
import useGetFetch from '../hooks/useGetFetch';
import { useSocket } from '../context/SocketContext.jsx';
import messageSound from '../assets/sounds/message.mp3';

const MessageContainer = () => {
  const { loading, error, getData } = useGetFetch();
  const [messages, setMessages] = useState([]);
  const handleToast = useHandleToast();
  const setConversations = useSetRecoilState(conversationsAtom);
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (selectedConversation?._id === message?.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // make a sound if the window is not focused
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prev) => {
        const updatedConversations = prev?.map((conversation) => {
          if (conversation?._id === message?.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message?.text,
                sender: message?.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off('newMessage');
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      if (selectedConversation?.mock) return;
      const data = await getData(
        `/api/messages/${selectedConversation?.userId}`
      );
      if (data && data?.messages) {
        setMessages(data?.messages);
      } else if (error) {
        handleToast('Error', error, 'error');
        return;
      }
    };

    getMessages();
  }, [handleToast, setMessages, selectedConversation?.userId]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages?.length &&
      messages[messages?.length - 1]?.sender !== currentUser?._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit('markMessagesAsSeen', {
        conversationId: selectedConversation?._id,
        userId: selectedConversation?.userId,
      });
    }

    socket.on('messagesSeen', ({ conversationId }) => {
      if (selectedConversation?._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              <Flex
                key={message?._id}
                direction={'column'}
                ref={
                  messages.length - 1 === messages.indexOf(message)
                    ? lastMessageRef
                    : null
                }
              >
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
