import React, { useContext, useEffect } from 'react';
import { Container, Row as Brow, Col } from 'react-bootstrap';

import cn from 'classnames';
import styles from './Table.module.sass';

import Crawler from './Crawler';
import useCampaignContents from '../../../hooks/useCampaignContents';
import Empty from './Empty';
import { GlobalShareContext } from '../../../App';
import { DataCrawledContext } from "../index";
import PaginationUi from "./PaginationUi";


const Table = ({ className, fileData, setCountRow, setFileData }) => {
  const { setGlobalShare } = useContext(GlobalShareContext);
  const { dataCrawled, activeDetectVoice } = useContext(DataCrawledContext);
  const { isSuccess, isLoading, contents, enabled } =
    useCampaignContents();

  useEffect(() => {
    const count = contents?.length ?? fileData?.length;
    (isSuccess || fileData.length) && setCountRow(count);
  }, [isSuccess, isLoading, setCountRow, fileData, contents]);

  useEffect(() => {
    if (isSuccess && contents.length) {
      setFileData([contents.map((content) => content.url)]);
    }
  }, [isSuccess, contents]);

  useEffect(() => {
    if (!enabled) {
      setGlobalShare([]);
    }
  }, [enabled]);

  return (
    <div className={cn(styles.wrapper, className)}>
      <Container fluid>
        <Brow
          className={cn(
            'mb-3 pb-3 border-bottom text-muted flex-nowrap',
            styles.border_bottom_color,
          )}
        >
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap pe-0',
              styles.col_image,
            )}
          ></Col>
          <Col
            xs={2}
            className={cn(
              'ps-4 flex-nowrap text-nowrap text-nowrap',
              styles.col_min_width_md,
            )}
          >
            Post URL
          </Col>
          <Col
            xs={2}
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width_md,
            )}
          >
            Title
          </Col>
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width,
            )}
          >
            Platform
          </Col>
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width,
            )}
          >
            Views
          </Col>
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width,
            )}
          >
            Likes
          </Col>
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width,
            )}
          >
            Shares
          </Col>
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width,
            )}
          >
            Comments
          </Col>
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width,
            )}
          >
            Save
          </Col>
          <Col
            className={cn(
              'd-flex justify-content-start align-items-center flex-nowrap',
              styles.col_min_width,
            )}
          >
            Uploaded
          </Col>
        </Brow>
        <PaginationUi activeDetectVoice={activeDetectVoice} array={dataCrawled} isLoading={((!!fileData && !!dataCrawled) && (dataCrawled.length !== fileData.length))} />
        {!!fileData.length ? (
          <Crawler linkList={fileData} />
        ) : (
          <Empty />
        )}
      </Container>
    </div>
  );
};

export default Table;
