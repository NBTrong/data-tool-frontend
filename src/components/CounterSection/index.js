import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import styles from './CounterSection.module.sass';

const CounterSection = ({ className, number = 94733, height = null }) => {
  const counterRef = useRef(null);

  useEffect(() => {
    const updateCounter = () => {
      const patt = /(\D+)?(\d+)(\D+)?(\d+)?(\D+)?/;
      const time = 0;
      let result = [...patt.exec(counterRef.current.textContent)];
      let fresh = true;
      let ticks;

      result.shift();
      result = result.filter((res) => res != null);

      while (counterRef.current.firstChild) {
        counterRef.current.removeChild(counterRef.current.firstChild);
      }

      for (let res of result) {
        if (isNaN(res)) {
          counterRef.current.insertAdjacentHTML(
            'beforeend',
            `<span>${res}</span>`,
          );
        } else {
          for (let i = 0; i < res.length; i++) {
            counterRef.current.insertAdjacentHTML(
              'beforeend',
              `<span data-value="${res[i]}">
<!--                <span>&ndash;</span>-->
                <span></span>
                ${Array(parseInt(res[i]) + 1)
                  .join(0)
                  .split(0)
                  .map(
                    (x, j) => `
                    <span>${j}</span>
                  `,
                  )
                  .join('')}
              </span>`,
            );
          }
        }
      }

      ticks = [...counterRef.current.querySelectorAll('span[data-value]')];

      let activate = () => {
        let top = counterRef.current.getBoundingClientRect().top;
        let offset = (window.innerHeight * 3) / 4;

        setTimeout(() => {
          fresh = false;
        }, time);

        if (top < offset) {
          setTimeout(
            () => {
              for (let tick of ticks) {
                let dist = parseInt(tick.getAttribute('data-value')) + 1;
                tick.style.transform = `translateY(-${dist * 100}%)`;
              }
            },
            fresh ? time : 0,
          );
          window?.removeEventListener('scroll', activate);
        }
      };

      window.addEventListener('scroll', activate);
      activate();
    };

    updateCounter(); // Chạy lần đầu khi CounterSection được mount

    return () => {
      window.removeEventListener('scroll', updateCounter);
    };
  }, [number]); // Theo dõi sự thay đổi của count

  return (
    <>
      {number ? (
        <section className={styles.counters}>
          <span
            ref={counterRef}
            className={cn(styles.counter, className)}
            style={height ? { height: height } : {}}
          >
            {number}
          </span>
        </section>
      ) : (
        <span ref={counterRef} className={className}>
          0
        </span>
      )}
    </>
  );
};

export default CounterSection;
