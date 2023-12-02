import React, { useCallback, useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import cn from 'classnames';
import styles from './Table.module.sass';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import SkeletonTable from './Skeleton';
import Row from './Row';
import ReactPaginate from 'react-paginate';
import Empty from '../../ExtractVideo/Table/Empty';
import useListInputFiles from '../../../hooks/useListInputFiles';
import { ConfirmContent, Modal } from '../../../components';
import Loading3Dots from '../../../components/Loading3DotsNoAbsolute';
import axios from 'axios';
import baseUrl from '../../../services/config/baseUrl';
import { toast } from 'react-toastify';
import useQueryString from '../../../hooks/useQueryString';
import CardWithoutPadding from '../../../components/CardWithoutPadding';
import { getPlatform, isValidHttpUrl } from '../../../utils/helpers';
import ModalFailedRow from '../ModalFailedRow';

const Table = ({ className, setCountQueues }) => {
  const [refresh, setRefresh] = useState(0);
  const [contents, setContents] = useState([]);
  const [failedRows, setFailedRows] = useState([]);
  const [isLoadingUpdateQueue, setIsLoadingUpdateQueue] = useState(false);
  const [isViewFailedRows, setIsViewFailedRows] = useState(false);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [actionSubmit, setActionSubmit] = useState(null);
  const { queryString } = useQueryString();
  const { search, page: pageQuery } = queryString;

  const [isPageChange, setIsPageChange] = useState(false);

  useEffect(() => {
    setIsPageChange(true);
  }, [pageQuery]);

  const {
    inputFiles,
    isSuccess,
    isLoading,
    page,
    limit,
    totalPage,
    handlePageChange,
    pagination,
    isPageChange: apiIsPageChange,
  } = useListInputFiles({ refresh, isPageChange: isPageChange });

  const handlePlushRefresh = useCallback(() => {
    setRefresh((prevRefresh) => prevRefresh + 1);
  }, []);

  useEffect(() => {
    setRefresh(0);
  }, [search, page]);

  useEffect(() => {
    if (inputFiles && isSuccess) {
      if (isPageChange) {
        if (apiIsPageChange) {
          setIsPageChange(false);
          setContents(inputFiles);
        }
      } else setContents(inputFiles);
    }
  }, [inputFiles, isSuccess, isPageChange, apiIsPageChange]);

  useEffect(() => {
    if (inputFiles && inputFiles.length) {
      const intervalId = setInterval(() => {
        setRefresh((prevRefresh) => prevRefresh + 1);
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [refresh, inputFiles]);

  useEffect(() => {
    if (isSuccess) {
      setCountQueues(pagination.total);
    }
  }, [pagination, isSuccess, isLoading, setCountQueues, inputFiles]);

  const handleActionSubmit = () => {
    if (actionSubmit) {
      handleUpdateStatus(actionSubmit);
    }
  };

  const handleUpdateStatus = useCallback(
    ({ id, status, noti }) => {
      setIsLoadingUpdateQueue(true);
      axios
        .put(
          baseUrl +
            `/input-file/${id}/update-progress?&fileInputId=${id}&status=${status}&progress=0&start_time=${new Date().toISOString()}`,
        )
        .then((response) => {
          toast.success('Status changed. ' + noti);
          handlePlushRefresh();
          setIsConfirmMode(false);
        })
        .catch(() => {
          toast.error('Something went wrong, please try again later');
        })
        .finally(() => {
          setIsLoadingUpdateQueue(false);
        });
    },
    [handlePlushRefresh],
  );

  const getRowKeyword = useCallback((text, tab) => {
    if (text.includes('channel-explore')) {
      const platform = getPlatform(text);
      if (isValidHttpUrl(text)) {
        return text;
      } else {
        if (platform === 'tiktok') {
          return 'https://tiktok.com/' + text;
        }
        if (platform === 'youtube') {
          return 'https://tiktok.com/@' + text.replace('@', '');
        }
        if (platform === 'instagram') {
          return 'https://www.instagram.com/' + text;
        }
      }
    }
    return text;
  }, []);

  return (
    <>
      <Modal visible={isConfirmMode} onClose={() => setIsConfirmMode(false)}>
        <ConfirmContent
          title="Confirm"
          description={actionSubmit?.noti}
          content={`Are you sure you want to ${
            actionSubmit?.status === 'created'
              ? 're-queue'
              : actionSubmit?.status
          } this queue?`}
          contentBtnSubmit="Confirm"
          contentBtnCancel="Cancel"
          isLoading={isLoadingUpdateQueue}
          onClose={() => setIsConfirmMode(false)}
          handleSubmit={handleActionSubmit}
        />
      </Modal>
      <Modal
        visible={isViewFailedRows}
        onClose={() => setIsViewFailedRows(false)}
      >
        <ModalFailedRow
          isViewFailedRows={isViewFailedRows}
          failedRows={failedRows}
          setIsViewFailedRows={setIsViewFailedRows}
        />
      </Modal>
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
            <Col xs={2} className={cn(styles.col)}>
              Type
            </Col>
            <Col className={styles.col}>Records</Col>
            <Col className={cn(styles.col, 'text-nowrap')}>Uploaded at</Col>
            <Col className={cn(styles.col, 'text-nowrap')}>Start time</Col>
            <Col className={cn(styles.col)}>Status</Col>
            <Col className={cn(styles.col)}>Progress</Col>
            <Col className={cn(styles.col, 'text-nowrap')}>Performance</Col>
            <Col className={cn(styles.col, 'text-nowrap')}>Total time</Col>
            <Col className={cn(styles.col)}></Col>
            <Col className={cn(styles.col)}></Col>
          </div>
          {isLoading && refresh === 0 && <SkeletonTable limit={limit} />}
          {!!contents.length &&
            (refresh !== 0 || isSuccess) &&
            contents.map(
              (inputFile) =>
                inputFile?.is_visible && (
                  <Row
                    setIsViewFailedRows={setIsViewFailedRows}
                    setFailedRows={setFailedRows}
                    item={inputFile}
                    handlePlushRefresh={handlePlushRefresh}
                    setIsConfirmMode={setIsConfirmMode}
                    setActionSubmit={setActionSubmit}
                  />
                ),
            )}
        </div>

        {isSuccess && !inputFiles.length && !search && (
          <Empty
            title={'No queue found'}
            noMargin={true}
            description={'Put your input files to queue'}
          />
        )}
        {!contents.length && search && isSuccess && (
          <Empty
            title={'No queue found'}
            noMargin={true}
            description={`Couldn't find any queue with the keyword: "${
              search ?? ''
            }"`}
          />
        )}
        <div
          className={'d-flex justify-content-end'}
          style={{ opacity: Number(isLoading && refresh !== 0) }}
        >
          <Loading3Dots
            style={{ width: 'unset', height: 'unset', color: '#979797' }}
          />
        </div>
        {totalPage > 0 && (
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
      </div>
    </>
  );
};

export default Table;
