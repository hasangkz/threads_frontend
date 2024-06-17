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
import UserFollowing from './UserFollowing';

const UserFollowings = ({ user, currentUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpenModal = () => {
    if (user?.following?.length !== 0 && currentUser) {
      onOpen();
    }
  };

  return (
    <>
      <Button onClick={handleOpenModal}>
        <Text color={'gray.ligth'}>{user?.following?.length} followings</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={'black'} color={'white'}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={'column'} gap={4}>
              {user?.following?.map((followingItem) => (
                <UserFollowing
                  currentUser={currentUser}
                  key={user._id}
                  userID={followingItem}
                />
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
