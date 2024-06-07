import { Box, Container } from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import userAtom from './atoms/userAtom';
import { useRecoilValue } from 'recoil';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import Header from './components/Header';

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/post/:postID' element={<PostPage />} />
      </Routes>
    </Container>
  );
}

export default App;
