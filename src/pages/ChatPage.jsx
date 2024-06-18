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
import useHandleToast from '../hooks/useHandleToast';
import useGetFetch from '../hooks/useGetFetch';

const ChatPage = () => {
  const { loading, error, getData } = useGetFetch();
  const [searchText, setSearchText] = useState('');
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const handleToast = useHandleToast();

  console.log('conversations', conversations);

  useEffect(() => {
    const getConversations = async () => {
      const data = await getData('/api/messages/conversations');
      if (data) {
        setConversations(data?.conversations);
      } else if (error) {
        handleToast('Error', error, 'error');
        return;
      }
    };
    getConversations();
  }, [handleToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    try {
      const searchedUser = await getData(`/api/users/profile/${searchText}`);
      setSearchText('');
      if (searchedUser && searchedUser?.user) {
        console.log('searchedUser', searchedUser);

        const messagingYourself = searchedUser?.user?._id === currentUser?._id;

        if (messagingYourself) {
          handleToast('Error', 'You cannot message yourself', 'error');
          return;
        }

        const conversationAlreadyExists = conversations?.find(
          (conversation) =>
            conversation?.participants?.length > 0 &&
            conversation?.participants?.[0]?._id === searchedUser?.user?._id
        );

        if (conversationAlreadyExists) {
          console.log('zaten var');
          setSelectedConversation({
            _id: conversationAlreadyExists._id,
            userId: searchedUser?.user?._id,
            username: searchedUser?.user?.username,
            userProfilePic: searchedUser?.user?.profilePic,
          });
          return;
        }

        console.log('yeni oluşturuluyor');

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
      } else if (error) {
        handleToast('Error', error, 'error');
        return;
      }
    } catch (error) {
      handleToast('Error', error.message, 'error');
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
            // eslint-disable-next-line react-hooks/rules-of-hooks
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
                isLoading={loading}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loading ? (
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
            ))
          ) : (
            <>
              {conversations?.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  // isOnline={onlineUsers.includes(
                  //   conversation.participants[0]._id
                  // )}
                  isOnline={false}
                  conversation={conversation}
                />
              ))}
            </>
          )}
        </Flex>

        {selectedConversation?._id ? (
          <MessageContainer />
        ) : (
          <>
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
              <Text fontSize={20}>
                Send and receive messages without your phone!
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;
