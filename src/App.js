import { Box, Container } from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import userAtom from './atoms/userAtom';
import { useRecoilValue } from 'recoil';

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  return <div>HELLO WORLD!</div>;
}

export default App;
