import { Avatar, Box, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { RiShareForwardLine } from 'react-icons/ri';
import { useToast } from '@chakra-ui/react';
import '../index.css';

const UserHeader = () => {
  const toast = useToast();

  const handleCopyUser = () => {
    const currentUserProfileURL = window.location.href;
    navigator.clipboard
      .writeText(currentUserProfileURL)
      .then(() => {
        toast({
          status: 'success',
          duration: 2000,
          isClosable: false,
          render: () => (
            <Box
              color='white'
              textAlign={'center'}
              p={2}
              bg='#42b883'
              borderRadius='15px'
            >
              Profile copied
            </Box>
          ),
        });
      })
      .catch((err) => {
        toast({
          status: 'error',
          duration: 2000,
          isClosable: false,
          render: () => (
            <Box
              color='white'
              textAlign={'center'}
              p={2}
              bg='#e84a5f'
              borderRadius='15px'
            >
              {err}
            </Box>
          ),
        });
      });
  };

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
              bg={'gray.light'}
              color={'white.light'}
              p={1}
              mt={1}
              letterSpacing={3}
              borderRadius={'15px'}
            >
              cormind
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={'avatar'}
            src='/zuck-avatar.png'
            size={{
              base: 'md',
              md: 'xl',
            }}
          />
        </Box>
      </Flex>

      <Box w='100%'>
        <Text>dsadasdasdasdas</Text>
      </Box>

      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.ligth'}>2k followers</Text>
          <Text color={'gray.black'} fontSize={'xl'}>
            |
          </Text>
          <Link color={'gray.ligth'}>instagram.com</Link>
        </Flex>

        <Flex>
          <Box className='icon-container'>
            <BsInstagram size={24} cursor={'pointer'} />
          </Box>
          <Box className='icon-container' onClick={handleCopyUser}>
            <RiShareForwardLine size={24} cursor={'pointer'} />
          </Box>
        </Flex>
      </Flex>

      <Flex justifyContent={'space-between'} w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1px solid white'}
          justifyContent={'center'}
          pb={4}
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>

        <Flex
          flex={1}
          borderBottom={'1px solid white'}
          justifyContent={'center'}
          pb={4}
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
