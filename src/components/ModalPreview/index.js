import React, { useCallback, useEffect } from 'react';
import cn from 'classnames';
import { createPortal } from 'react-dom';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import OutsideClickHandler from 'react-outside-click-handler';
import styles from './ModalProduct.module.sass';
import Panel from './Panel';
import Slider from 'react-slick';
import Icon from '../Icon';

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const SLIDER_SETTINGS = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: (
    <SlickArrow>
      <Icon name="arrow-right" size="24" />
    </SlickArrow>
  ),
  prevArrow: (
    <SlickArrow>
      <Icon name="arrow-left" size="24" />
    </SlickArrow>
  ),
};

const ModalProduct = ({
  visible,
  onClose,
  video,
  gallery,
  download,
  title,
  figcaption,
  galleryItemRender,
}) => {
  const escFunction = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    try {
      document.addEventListener('keydown', escFunction, false);
      return () => {
        document.removeEventListener('keydown', escFunction, false);
      };
    } catch (e) {}
  }, [escFunction]);

  useEffect(() => {
    if (visible) {
      const target = document.querySelector('#modal-product');
      disableBodyScroll(target);
    } else {
      clearAllBodyScrollLocks();
    }
  }, [visible]);

  return createPortal(
    visible && (
      <div id="modal-product" className={styles.modal}>
        <div className={styles.outer}>
          <OutsideClickHandler onOutsideClick={onClose}>
            <Panel
              title={title}
              onClose={onClose}
              download={download}
              galleryPanel={gallery}
            />
            {video && (
              <div className={styles.video}>
                <video controls>
                  <source
                    src={video}
                    type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                  />
                </video>
              </div>
            )}
            {gallery && (
              <div className={styles.wrapper}>
                <Slider className="photo-slider" {...SLIDER_SETTINGS}>
                  {gallery.map((x, index) => (
                    <div className={styles.slide} key={index}>
                      <div className={styles.preview}>
                        {galleryItemRender ? (
                          galleryItemRender(x)
                        ) : (
                          <img src={x} alt="Gallery" />
                        )}
                      </div>
                    </div>
                  ))}
                </Slider>
                {figcaption && (
                  <div className={styles.figcaption}>{figcaption}</div>
                )}
              </div>
            )}
          </OutsideClickHandler>
        </div>
      </div>
    ),
    document.body,
  );
};

export default ModalProduct;
