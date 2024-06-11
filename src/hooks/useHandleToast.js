import { useToast } from '@chakra-ui/toast';
import { useCallback } from 'react';

const useHandleToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 3000,
      });
    },
    [toast]
  );

  return showToast;
};

export default useHandleToast;
