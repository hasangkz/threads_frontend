import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import useHandleToast from '../hooks/useHandleToast';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import useHandleImage from '../hooks/useHandleImage';
import usePostFetch from '../hooks/usePostFetch';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const handleToast = useHandleToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = useHandleImage();
  const { loading, error, postData } = usePostFetch();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;

    const data = await postData('/api/messages', {
      message: messageText,
      recipientId: selectedConversation?.userId,
      img: imgUrl,
    });

    if (data && data?.newMessage) {
      setMessages((messages) => [...messages, data?.newMessage]);
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation?._id === selectedConversation?._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText('');
      setImgUrl('');
    } else if (error) {
      handleToast('Error', error, 'error');
      return;
    }
  };

  return (
    <Flex gap={2} alignItems={'center'}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={'full'}
            placeholder='Type a message'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={'pointer'}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input
          type={'file'}
          hidden
          ref={imageRef}
          onChange={handleImageChange}
        />
      </Flex>
      <Modal
        isOpen={imgUrl}
        onClose={() => {
          onClose();
          setImgUrl('');
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={'full'}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={'flex-end'} my={2}>
              {loading ? (
                <Spinner size={'md'} />
              ) : (
                <IoSendSharp
                  size={24}
                  cursor={'pointer'}
                  onClick={handleSendMessage}
                />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
