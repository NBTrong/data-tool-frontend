import React, { createContext } from 'react';
import { Modal, Image } from '../components';
import styles from '../screens/SignIn/SignIn.module.sass';

const UnderDevelopmentContext = createContext();

function UnderDevelopmentProvider({ children }) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <UnderDevelopmentContext.Provider value={{ setShowModal }}>
        <Modal
          outerClassName=""
          visible={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className={styles.content}>
            <Image
              className={styles.image}
              src="images/UnderDevelopment.png"
              srcSet="images/UnderDevelopment.png"
              width={150}
            />
            <p className={styles.title1}>Functions under development</p>
          </div>
        </Modal>
        {children}
      </UnderDevelopmentContext.Provider>
    </>
  );
}

export { UnderDevelopmentContext, UnderDevelopmentProvider };
