import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost
        likes={200}
        replies={420}
        postImage={
          'https://cdn.motor1.com/images/mgl/kvjPR/s1/4x3/2022-porsche-911-carrera-gts-front-3-4.webp'
        }
        postTitle={'title1'}
      />
      <UserPost
        likes={200}
        replies={420}
        postImage={
          'https://hips.hearstapps.com/hmg-prod/images/2025-porsche-911-spied-front-658200b0a3a5d.jpg'
        }
        postTitle={'title2'}
      />
      <UserPost
        likes={200}
        replies={420}
        postTitle={'asdsadasffasfasfasfasd'}
      />
    </>
  );
};

export default UserPage;
