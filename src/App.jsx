import { Box, Container } from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import userAtom from './atoms/userAtom';
import { useRecoilValue } from 'recoil';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  console.log('user', user);

  return (
    <Box position={'relative'} w='full'>
      <Container
        maxW={pathname === '/' ? { base: '620px', md: '900px' } : '620px'}
      >
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/auth'
            element={!user ? <AuthPage /> : <Navigate to='/' />}
          />
          <Route path='/:username' element={<UserPage />} />
          <Route path='/:username/post/:postID' element={<PostPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
