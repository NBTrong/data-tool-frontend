import Tooltip from '../../Tooltip';

import cn from 'classnames';
import styles from '../RHFLabel/RHFLabel.module.sass';

const RHFLabel = ({
  classLabel,
  label = 'Label',
  place = 'right',
  tooltip = 'This is tooltip',
}) => {
  return (
    <div className={cn(classLabel, styles.label)}>
      {label}{' '}
      <Tooltip
        className={cn(styles.tooltip)}
        title={tooltip}
        icon="info"
        place={place}
        error={true}
      />
    </div>
  );
};

export default RHFLabel;
