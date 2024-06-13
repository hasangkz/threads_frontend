import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SuggestedUser from './SuggestedUser';
import useHandleToast from '../hooks/useHandleToast';
import useGetFetch from '../hooks/useGetFetch';

const Suggest = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { loading, error, getData } = useGetFetch();
  const handleToast = useHandleToast();
  useEffect(() => {
    const getSuggestedUsers = async () => {
      const data = await getData('/api/users/suggest');
      if (data) {
        setSuggestedUsers(data?.suggestedUsers);
      } else if (error) {
        handleToast('Error', error, 'error');
        return;
      }
    };

    getSuggestedUsers();
  }, [handleToast]);

  return (
    <>
      <>
        <Text mb={4} fontWeight={'bold'}>
          Suggested Users
        </Text>
        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={'center'}
              p={'1'}
              borderRadius={'md'}
            >
              {/* avatar skeleton */}
              <Box>
                <SkeletonCircle size={'10'} />
              </Box>
              {/* username and fullname skeleton */}
              <Flex w={'full'} flexDirection={'column'} gap={2}>
                <Skeleton h={'8px'} w={'80px'} />
                <Skeleton h={'8px'} w={'90px'} />
              </Flex>
              {/* follow button skeleton */}
              <Flex>
                <Skeleton h={'20px'} w={'60px'} />
              </Flex>
            </Flex>
          ))}
        <Flex direction={'column'} gap={4}>
          {suggestedUsers?.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
        </Flex>
      </>
    </>
  );
};

export default Suggest;
