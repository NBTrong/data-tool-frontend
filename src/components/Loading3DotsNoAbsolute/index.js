import React from 'react';
import cn from 'classnames';
import styles from './Loading3Dots.module.sass';

export default function Loading3Dots({style}) {
    return (
        <div className={cn(styles.container)} style={style}>
            <div className={cn(styles.loader)}>
                {/* <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div>
        <div className={cn(styles.loader__dot)}></div> */}
                <div className={cn(styles.loader__text)}></div>
            </div>
        </div>
    );
}
