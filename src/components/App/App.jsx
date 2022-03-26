import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Container, Header, Wrapper, Text } from './App.styled';
import { fetchImagesByTag } from '../../js/fetchImages';

import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Loader } from 'components/Loader/Loader';
import { Button } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

export const App = () => {
  const [serchTag, setSerchTag] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(null);

  const [modalImg, setModalImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const pages = useRef(null);

  useEffect(() => {
    if (page === null) {
      return;
    }
    console.log('lolllololo ', Date.now());
    setLoading(true);

    fetchImagesByTag(serchTag, page)
      .then(({ hits, totalHits, totalPages }) => {
        if (!hits.length) {
          throw new Error(
            'Sorry, there are no images matching your search query . Please try again.'
          );
        }

        if (page === 1) {
          notify('success', `Hooray! We found ${totalHits} images.`);
        }

        if (page === pages.current) {
          notify(
            'warning',
            `We're sorry, but you've reached the end of search results.`
          );
        }

        setImages(prevState => [...prevState, ...hits]);
        pages.current = totalPages;
      })
      .catch(error => {
        notify('error', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serchTag, page]);

  const handleFormSubmit = newSerchTag => {
    if (newSerchTag === serchTag) {
      notify('info', 'Please, enter another search tag.');
      return;
    }
    setImages([]);
    setPage(1);
    pages.current = null;
    setSerchTag(newSerchTag);
  };

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const togleModal = (img = false) => setModalImg(img);

  const notify = (type, text) => {
    const options = {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    };

    if (type === 'error') {
      toast.error(text, options);
    }
    if (type === 'success') {
      toast.success(text, options);
    }
    if (type === 'warning') {
      toast.warn(text, options);
    }
    if (type === 'info') {
      toast.info(text, options);
    }
  };

  const isStartSearch = Boolean(images.length);
  const isNotStartSearch = !isStartSearch && !loading;
  const isShowLoadMore = !loading && page < pages.current;

  return (
    <>
      <Header>
        <Container>
          <Searchbar onSerchSubmit={handleFormSubmit} notify={notify} />
        </Container>
      </Header>
      <Container>
        <Wrapper>
          {isNotStartSearch && (
            <Text>
              Hey! We'll be happy to help you find the image you need.
            </Text>
          )}
          {isStartSearch && (
            <ImageGallery images={images} onItemlick={togleModal} />
          )}
          {isShowLoadMore && (
            <Button text="Load more..." disabled={false} onClick={loadMore} />
          )}
          {loading && (
            <Button text="Loading..." disabled={true}>
              <Loader />
            </Button>
          )}
        </Wrapper>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {modalImg && <Modal img={modalImg} onClose={togleModal} />}
    </>
  );
};
