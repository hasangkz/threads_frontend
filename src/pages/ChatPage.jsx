import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Conversation from '../components/Conversation';
import { LuMessagesSquare } from 'react-icons/lu';
import MessageContainer from '../components/MessageContainer';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
import useHandleToast from '../hooks/useHandleToast';

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const handleToast = useHandleToast();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch('/api/messages/conversations');
        const data = await res.json();
        if (data.error) {
          handleToast('Error', data.error, 'error');
          return;
        }
        setConversations(data?.messages);
      } catch (error) {
        handleToast('Error', error.message, 'error');
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [handleToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        handleToast('Error', searchedUser.error, 'error');
        return;
      }

      const messagingYourself = searchedUser?.user?._id === currentUser?._id;
      if (messagingYourself) {
        handleToast('Error', 'You cannot message yourself', 'error');
        return;
      }

      const conversationAlreadyExists = conversations?.find(
        (conversation) =>
          conversation.participants[0]._id === searchedUser?.user?._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser?.user?._id,
          username: searchedUser?.user?.username,
          userProfilePic: searchedUser?.user?.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: '',
          sender: '',
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser?.user?._id,
            username: searchedUser?.user?.username,
            profilePic: searchedUser?.user?.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      handleToast('Error', error.message, 'error');
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={'absolute'}
      left={'50%'}
      w={{ base: '100%', md: '80%', lg: '750px' }}
      p={4}
      transform={'translateX(-50%)'}
    >
      <Flex
        gap={4}
        flexDirection={{ base: 'column', md: 'row' }}
        maxW={{
          sm: '400px',
          md: 'full',
        }}
        mx={'auto'}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={'column'}
          maxW={{ sm: '250px', md: 'full' }}
          mx={'auto'}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            Your Chats
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={'center'} gap={2}>
              <Input
                placeholder='Search a friend'
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={'sm'}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4]?.map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={'center'}
                p={'1'}
                borderRadius={'md'}
              >
                <Box>
                  <SkeletonCircle size={'10'} />
                </Box>
                <Flex w={'full'} flexDirection={'column'} gap={3}>
                  <Skeleton h={'10px'} w={'80px'} />
                  <Skeleton h={'8px'} w={'90%'} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations?.map((conversation) => (
              <Conversation
                key={conversation._id}
                // isOnline={onlineUsers.includes(
                //   conversation.participants[0]._id
                // )}
                isOnline={false}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={'md'}
            p={2}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            height={'400px'}
          >
            <LuMessagesSquare size={100} />
            <Text fontSize={20}>Let's talk!</Text>
          </Flex>
        )}

        {selectedConversation?._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
