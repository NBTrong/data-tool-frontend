import { Link } from 'react-router-dom';

import styles from './LogoContainer.module.sass';

import { Image } from '../';

function LogoContainer() {
  return (
    <div className={styles.logoContainer}>
      <Link className={styles.logo} to="/">
        <Image
          className={styles.pic}
          src="/images/logo.png"
          srcDark="/images/logo.png"
          alt="Core"
        />
      </Link>
      <div className={styles.subLogo}>
        <p>Social</p>
        <p>Data Extraction</p>
      </div>
    </div>
  );
}

export default LogoContainer;
