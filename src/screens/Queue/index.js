import React, { useState, createContext, useCallback, useContext } from 'react';

import cn from 'classnames';
import styles from './Content.module.sass';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Card, Modal } from '../../components';

import Table from './Table';
import { EXTRACT_DATA_EXCEL_TEMPLATE } from '../../utils/helpers';
import { exportExcelData } from './Export';
import { useNavigate } from 'react-router-dom';
import ConfirmContentWithInput from '../../components/ConfirmContentWithInput';
import { addCampaignSchema } from '../../utils/ValidateSchema';
import useQueryString from '../../hooks/useQueryString';
import { FiSearch } from 'react-icons/fi';

export const DataCrawledContext = createContext([]);

export default function Queue() {
  const [countCampaign, setCountQueues] = useState([]);
  const { queryString, setQueryString } = useQueryString();

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      const query = queryString;
      query.search = e.target.value;
      query.page = 1;
      query.limit = 10;
      setQueryString(query);
    }
  };

  return (
    <>
      <Card
        id={'extractCard'}
        className={cn(styles.card, 'min-h-screen')}
        title={(countCampaign ?? '0') + ' Queues'}
        classTitle={cn('title-purple text-nowrap', styles.title)}
        classCardHead={cn(
          styles.head,
          { [styles.hidden]: false },
          'flex-nowrap align-items-center mb-4',
        )}
        head={
          <>
            <div
              className={
                'w-100 d-flex justify-content-between align-items-center'
              }
            >
              <div>
                <div
                  className={
                    'd-flex align-items-center bg-white rounded-4 position-relative bg-gray'
                  }
                >
                  <div className="ps-3">
                    <FiSearch className={'fs-4 text-muted me-1'} />
                  </div>
                  <input
                    className={cn('TagInput_input__Wm1AN bg-gray input-search')}
                    defaultValue={queryString?.search}
                    type="text"
                    onKeyUp={handleKeyUp}
                    placeholder="Search by name and tab, press enter to search"
                    maxLength="256"
                  />
                </div>
              </div>
              <div></div>
            </div>
          </>
        }
      >
        <div
          className={cn(
            styles.row,
            { [styles.flex]: false },
            styles.overflow_scroll_but_hide_scrollbar,
          )}
        >
          <Table
            setCountQueues={setCountQueues}
            className={styles.table}
          ></Table>
        </div>
      </Card>
    </>
  );
}
