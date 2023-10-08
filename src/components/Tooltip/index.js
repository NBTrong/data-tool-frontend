import React, {useState} from 'react';
import ReactTooltip from 'react-tooltip';

import cn from 'classnames';
import styles from './Tooltip.module.sass';

import Icon from '../Icon';

const Tooltip = ({className, title, icon, place, children, iconFill = "#6F767E"}) => {
    const [randomID, setRandomID] = useState(String(Math.random()))
    return (
        <div className={cn(styles.tooltip, className)}>
              <span data-tip={title} data-place={place ? place : 'right'} data-for={randomID}>
                  {children && (
                      children
                  )}
                  {icon &&
                      <Icon name={icon} fill={iconFill} className={'ms-1'}/>}
              </span>
            <ReactTooltip id={randomID} effect='solid'/>
        </div>
    );
};

export default Tooltip;
