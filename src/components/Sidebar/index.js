import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Sidebar.module.sass';
import cn from 'classnames';

import Icon from '../Icon';
import Dropdown from './Dropdown';
import LogoContainer from '../LogoContainer';
import QueueTab from './QueueTab';

const navigation = [
  {
    title: 'Extract Data',
    icon: 'database',
    dropdown: [
      {
        title: 'Extract videos',
        url: '/extract-data/videos',
      },
      {
        title: 'Extract comments',
        url: '/extract-data/comments',
      },
    ],
  },
  {
    title: 'Channel Explore',
    icon: 'searchUser',
    dropdown: [
      {
        title: 'Tiktok',
        url: '/channel-explore/tiktok',
      }
    ],
  },
  {
    title: 'Keyword Explore',
    icon: 'search',
    dropdown: [
      {
        title: 'Tiktok',
        url: '/keyword-explore/tiktok',
      }
    ],
  },

];

const Sidebar = ({ className, onClose }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        className={cn(styles.sidebar, className, { [styles.active]: visible })}
      >
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="24" />
        </button>
        <LogoContainer className={styles.logo} />
        <div className={styles.menu}>
          {navigation.map((x, index) =>
            x.url ? (
              <NavLink
                className={({ isActive }) =>
                  cn(styles.item, { [styles.active]: isActive })
                }
                to={x.url}
                key={index}
                end
                onClick={onClose}
              >
                <Icon name={x.icon} size="24" />
                {x.title}
              </NavLink>
            ) : (
              <Dropdown
                className={styles.dropdown}
                visibleSidebar={visible}
                setValue={setVisible}
                key={index}
                item={x}
                onClose={onClose}
              />
            ),
          )}
          <QueueTab key={navigation?.title} onClose={onClose} />
        </div>
        <button className={styles.toggle} onClick={() => setVisible(!visible)}>
          <Icon name="arrow-right" size="24" />
          <Icon name="close" size="24" />
        </button>
        {/* <div className={styles.foot}>
          <NavLink
            className={({ isActive }) =>
              cn(styles.item, { [styles.active]: isActive })
            }
            to={'/performance-analytics'}
            end
            onClick={() => {
              onClose();
              setVisible(false);
            }}
          >
            <Icon name="bar-chart" size="24" />
            Performance Analytics
          </NavLink>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;
