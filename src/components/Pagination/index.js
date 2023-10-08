import ReactPaginate from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import cn from 'classnames';
import styles from './Pagination.module.sass';
import useQueryString from '../../hooks/useQueryString';
import { useCallback } from 'react';

export default function Pagination({ pageCount, forcePage, onPageChange }) {
  const { queryString, setQueryString } = useQueryString();
  const { page } = queryString;

  const handlePageChange = useCallback(
    ({ selected }) => {
      setQueryString({ ...queryString, page: selected + 1 });
    },
    [queryString, setQueryString],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
      }}
    >
      <ReactPaginate
        activeClassName={cn(styles.item, styles.active)}
        breakClassName={cn(styles.item)}
        breakLabel={'...'}
        marginPagesDisplayed={2}
        paddingPagesDisplayed={2}
        pageRangeDisplayed={2}
        containerClassName={cn(styles.pagination)}
        disabledClassName={cn(styles.item, styles.disabled)}
        nextClassName={cn(styles.item, styles.next)}
        nextLabel={<IoIosArrowForward />}
        onPageChange={onPageChange || handlePageChange}
        pageCount={pageCount}
        forcePage={forcePage || page - 1 || 0}
        pageClassName={cn(styles.item, 'pagination-page')}
        previousClassName={cn(styles.item, styles.previous)}
        previousLabel={<IoIosArrowBack />}
      />
    </div>
  );
}
