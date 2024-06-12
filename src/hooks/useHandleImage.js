import { useState } from 'react';
import useHandleToast from './useHandleToast';

const useHandleImage = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const handleToast = useHandleToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      handleToast('Invalid file type', 'Please select an image!', 'error');
      setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl };
};

export default useHandleImage;
