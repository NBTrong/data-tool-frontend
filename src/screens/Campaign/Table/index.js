import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';

import cn from 'classnames';
import styles from './Table.module.sass';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import useListCampaigns from '../../../hooks/useListCampaigns';
import SkeletonTable from './Skeleton';
import Row from './Row';
import ReactPaginate from 'react-paginate';
import Empty from '../../ExtractVideo/Table/Empty';

const Table = ({ className, setCountCampaigns, setFileExport }) => {
  const {
    listCampaigns,
    isSuccess,
    isLoading,
    page,
    limit,
    totalPage,
    handlePageChange,
    pagination,
  } = useListCampaigns();

  useEffect(() => {
    if (isSuccess) {
      setCountCampaigns(pagination.total);
      setFileExport(listCampaigns);
    }
  }, [pagination, isSuccess, isLoading, setCountCampaigns, listCampaigns]);

  return (
    <div
      className={cn(
        styles.wrapper,
        className,
        'd-flex justify-content-between flex-column',
      )}
      style={{ minHeight: '60vh' }}
    >
      <div className={cn(styles.table)}>
        <div className={cn(styles.row)}>
          <Col xs={2} className={cn(styles.col)}>
            Name
          </Col>
          <Col xs={2} className={styles.col}>
            Platforms
          </Col>
          <Col className={cn(styles.col, 'text-nowrap')}>Total Contents</Col>
          <Col className={cn(styles.col)}>Views</Col>
          <Col className={cn(styles.col)}>Save</Col>
          <Col className={cn(styles.col)}>Likes</Col>
          <Col className={cn(styles.col)}>Shares</Col>
          <Col className={cn(styles.col)}>Comments</Col>
          <Col className={cn(styles.col)}>Imported At</Col>
          <Col className={cn(styles.col)}></Col>
        </div>
        {isLoading && <SkeletonTable limit={limit} />}
        {isSuccess &&
          listCampaigns?.length > 0 &&
          listCampaigns.map((campaign) => <Row item={campaign}></Row>)}
      </div>
      {isSuccess && totalPage > 0 && (
        <>
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
              onPageChange={handlePageChange}
              pageCount={totalPage || 5}
              forcePage={page - 1 || 0}
              pageClassName={cn(styles.item, 'pagination-page')}
              previousClassName={cn(styles.item, styles.previous)}
              previousLabel={<IoIosArrowBack />}
            />
          </div>
        </>
      )}
      {isSuccess && !listCampaigns.length && (
        <Empty
          title={'No campaigns found'}
          description={'Save your exported files as campaign'}
        />
      )}
    </div>
  );
};

export default Table;
