import React from 'react';

import cn from 'classnames';
import styles from './TableHeadingSort.module.sass';
import { Col } from 'react-bootstrap';
import { BiSortAlt2 } from 'react-icons/bi';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

const Heading = ({ summaryField, handleSort, displayIcon }) => {
  return (
    <>
      {summaryField.map((item, index) => {
        return (
          <Col className={cn(styles.col)}>
            <div
              className={'d-flex flex-nowrap cursor-pointer'}
              onClick={() => {
                handleSort(item?.field);
              }}
            >
              <div className={'d-flex align-items-center'}>
                {item?.logo && (
                  <img
                    src={item.logo}
                    alt={item.text + 'logo'}
                    className={'logo me-2'}
                  />
                )}
                <div
                  className={'text-nowrap'}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                ></div>
              </div>
              {/* <div className="cursor-pointer ms-1">
                {displayIcon[index] === 'default' && <BiSortAlt2 />}
                {displayIcon[index] === 'DESC' && <AiOutlineArrowDown />}
                {displayIcon[index] === 'ASC' && <AiOutlineArrowUp />}
              </div> */}
              {/*{item.spacing && <span className='opacity-0'>Volume</span>}*/}
            </div>
          </Col>
        );
      })}
    </>
  );
};

export default Heading;
