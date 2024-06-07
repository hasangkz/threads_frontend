import { Avatar, Box, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import '../index.css';

const UserHeader = () => {
  return (
    <VStack gap={4} align='start'>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            hasan gokgoz
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>hasangkz</Text>

            <Text
              fontSize={'xs'}
              bg={'gray.dark'}
              color={'gray.light'}
              p={1}
              borderRadius={'full'}
            >
              cormind
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar name={'avatar'} src='/zuck-avatar.png' size={'xl'} />
        </Box>
      </Flex>

      <Box>
        <Text>oyle birisi</Text>
      </Box>

      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.ligth'}>2k followers</Text>
          <Link color={'gray.ligth'}>instagram.com</Link>
        </Flex>

        <Box className='icon-container'>
          <BsInstagram size={24} cursor={'pointer'} />
        </Box>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
