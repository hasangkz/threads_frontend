import {
  Flex,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import UserFollowing from './UserFollowing';

const UserFollowings = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useRecoilValue(userAtom);
  const handleOpenModal = () => {
    console.log('sa');
    if (user?.following?.length !== 0 && currentUser) {
      onOpen();
    }
  };
  return (
    <>
      <Button onClick={handleOpenModal}>
        <Text color={'gray.ligth'}>{user?.following?.length} following</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={'black'} color={'white'}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={'column'} gap={4}>
              {user?.following?.map((followingItem) => (
                <UserFollowing key={user._id} userID={followingItem} />
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserFollowings;
