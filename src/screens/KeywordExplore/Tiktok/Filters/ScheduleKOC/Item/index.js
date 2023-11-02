import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import cn from 'classnames';
import styles from './Item.module.sass';

import Icon from '../../../../../../components/Icon';

const Item = ({
  className,
  category,
  value,
  icon,
  children,
  visible,
  setVisible,
}) => {
  return (
    <div className={cn(styles.item, className, { [styles.active]: visible })}>
      <div className={styles.head} onClick={() => setVisible(!visible)}>
        <Icon name={icon} size="24" />
        <div className={styles.details}>
          <div className={styles.category}>{category}</div>
          <div className={styles.value}>{value}</div>
        </div>
      </div>
      <div className={cn('start-0', styles.body)} style={{ zIndex: 999 }}>
        <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
          {children}
        </OutsideClickHandler>
      </div>
    </div>
  );
};

export default Item;
