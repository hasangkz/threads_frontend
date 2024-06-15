import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import useHandleImage from '../hooks/useHandleImage';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useHandleToast from '../hooks/useHandleToast';
import postsAtom from '../atoms/postsAtom';
import { useParams } from 'react-router-dom';
import usePostFetch from '../hooks/usePostFetch';

const MAX_CHAR = 120;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState('');
  const { handleImageChange, imgUrl, setImgUrl } = useHandleImage();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const handleToast = useHandleToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const { loading, error, postData } = usePostFetch();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  const handleCreatePost = async () => {
    const data = await postData('/api/posts/create', {
      postedBy: user._id,
      text: postText,
      img: imgUrl,
    });

    if (data) {
      if (username === user?.username) {
        setPosts([data, ...posts]);
      }
      onClose();
      setPostText('');
      setImgUrl('');
      handleToast('Success', 'Thrad created successfully!', 'success');
    } else if (error) {
      handleToast('Error', error, 'error');
      return;
    }
  };

  return (
    <>
      <Button
        position={'fixed'}
        bottom={10}
        right={5}
        bg={useColorModeValue('gray.300', 'gray.dark')}
        onClick={onOpen}
        size={{ base: 'sm', sm: 'md' }}
      >
        Create
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent bg={'black'} color={'white'}>
          <ModalHeader>Create Thread</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder='What are u thinking?'
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize='xs'
                fontWeight='bold'
                textAlign={'right'}
                m={'1'}
                color={'gray.800'}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type='file'
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={'full'} position={'relative'}>
                <Image src={imgUrl} alt='Selected img' />
                <CloseButton
                  onClick={() => {
                    setImgUrl('');
                  }}
                  bg={'gray.800'}
                  position={'absolute'}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='teal'
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              <Text>Create the Thread!</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
