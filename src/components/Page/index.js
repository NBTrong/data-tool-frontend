import React, { useState } from 'react';
import cn from 'classnames';
import styles from './Page.module.sass';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { Outlet } from 'react-router';

const Page = ({ wide, children, title, headerElements }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={styles.page}>
        <Sidebar
          className={cn(styles.sidebar, { [styles.visible]: visible })}
          onClose={() => setVisible(false)}
        />
        <Header onOpen={() => setVisible(true)} />
        <div className={styles.inner}>
          <div
            className={cn(styles.container, {
              [styles.wide]: wide,
            })}
          >
            <div className={cn(styles.header)}>
              {title && <h3 className={cn('h3', styles.title)}>{title}</h3>}
              {headerElements}
            </div>
            {children}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
