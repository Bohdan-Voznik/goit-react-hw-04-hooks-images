import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Overlay, Image } from './Modal.styled';
const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ img, onClose }) => {
  useEffect(() => {
    window.addEventListener('keydown', onEscClick);
    return () => {
      window.removeEventListener('keydown', onEscClick);
    };
  });

  const onOverlayClick = evt => {
    if (evt.currentTarget === evt.target) {
      onClose();
    }
  };

  const onEscClick = evt => {
    if (evt.code === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={onOverlayClick}>
      <Image src={img} />
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  img: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
