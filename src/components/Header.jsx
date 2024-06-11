import { Flex, Image, useColorMode } from '@chakra-ui/react';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={'center'} mt={6} mb={'12'}>
      <Image
        cursor={'pointer'}
        onClick={toggleColorMode}
        alt='threads-logo'
        w={8}
        src={colorMode === 'dark' ? '/light-logo.png' : '/dark-logo.png'}
      />
    </Flex>
  );
};

export default Header;
