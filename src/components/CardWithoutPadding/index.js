import React from 'react';
import cn from 'classnames';
import styles from './CardWithoutPadding.module.sass';

const CardWithoutPadding = ({
  className,
  title,
  classTitle,
  classCardHead,
  head,
  children,
}) => {
  return (
    <div className={cn(styles.card, className)}>
      {title && (
        <div className={cn(styles.head, classCardHead)}>
          <div className={cn(classTitle, styles.title)} dangerouslySetInnerHTML={{__html: title}}></div>
          {head && head}
        </div>
      )}
      {children}
    </div>
  );
};

export default CardWithoutPadding;
