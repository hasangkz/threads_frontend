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
import UserFollower from './UserFollower';

const UserFollowers = ({ user, currentUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = () => {
    if (user?.followers?.length !== 0 && currentUser) {
      onOpen();
    }
  };

  return (
    <>
      <Button onClick={handleOpenModal}>
        <Text color={'gray.ligth'}>{user?.followers?.length} followers</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={'black'} color={'white'}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={'column'} gap={4}>
              {user?.followers?.map((followerItem) => (
                <UserFollower
                  currentUser={currentUser}
                  key={user?._id}
                  userID={followerItem}
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

export default UserFollowers;
