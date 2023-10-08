import cn from 'classnames';
import styles from './BorderBottomOuter.module.sass';

function BorderBottomOuter({ children, className }) {
  return <div className={cn(styles.nameBorder, className)}>{children}</div>;
}

export default BorderBottomOuter;
