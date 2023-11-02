import React, { useState, createContext, useCallback } from 'react';

import cn from 'classnames';
import styles from './Content.module.sass';
import * as XLSX from 'xlsx';
import { Card } from '../../../components';

import Table from './Table';
import FiltersForm from './Filters';
import { AiOutlinePlus } from 'react-icons/ai/index';
import { BiDownload } from 'react-icons/bi/index';
import SearchInput from './SearchInput';
import { exportExcelData } from './Export/export';
import Filters from '../../../components/Filters';
import {processFileToArray} from "../../../utils/helpers";

export const DataCrawledContext = createContext([]);

export default function KeywordExplore() {
  const [searchValues, setSearchValues] = useState([]);
  const [typeFilter, setTypeFilter] = useState('post');
  const [fileExport, setFileExport] = useState([]);
  const [dataCrawled, setDataCrawled] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [countResult, setCountResult] = useState('0 Result');

  const filterData = useCallback((arr) => {
    return arr
      .flatMap((item) => item.filter(Boolean))
      .map((item, index) => {
        return {
          id: index + 1 + '',
          text: item,
        };
      });
  }, []);

  const readExcelFile = useCallback(() => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.xlsx';
    inputElement.onchange = async () => {
      const file = inputElement.files[0];
      const rows = await processFileToArray(file)
      const filteredData = filterData(rows);
      setSearchValues(filteredData);
    };

    inputElement.click();
  }, []);

  const handleExportData = (e) => {
    e.preventDefault();
    exportExcelData(fileExport, typeFilter);
  };

  const handleUploadFileExcel = (e) => {
    e.preventDefault();
    readExcelFile();
  };

  return (
    <DataCrawledContext.Provider value={{ dataCrawled, setDataCrawled }}>
      <>
        <div
          className={'mb-4 d-flex align-items-center justify-content-between'}
        >
          <div className={'me-5'}>
            <SearchInput
              onInputChange={setKeywords}
              searchValues={searchValues}
            />
          </div>
          <div>
            <button
              className={cn(
                'button-small fs-mobile py-sm-4 text-nowrap px-3 py-1  border opacity-75',
                styles.btnAdd,
              )}
              onClick={handleUploadFileExcel}
            >
              <AiOutlinePlus className={cn(styles.icon)} />
              Upload Keywords List
            </button>
          </div>
        </div>
        <Card
          id={'extractCard'}
          className={cn(styles.card, 'min-h-screen')}
          title={countResult}
          classTitle={cn('title-purple text-nowrap', styles.title)}
          classCardHead={cn(
            styles.head,
            { [styles.hidden]: false },
            'flex-nowrap align-items-center mb-3',
          )}
          head={
            <>
              <div
                className={
                  'w-100 d-flex justify-content-between align-items-center'
                }
              >
                <div></div>
                <div className={'d-flex align-items-center'}>
                  <Filters title="Filter">
                    <FiltersForm />
                  </Filters>
                  <button
                    className={cn(
                      styles.link,
                      styles.btnExport,
                      'm-0 fs-mobile px-2 py-md-2 py-1 px-md-3',
                    )}
                    onClick={handleExportData}
                  >
                    Download (Excel)
                    <BiDownload className={cn(styles.icon)} />
                  </button>
                </div>
              </div>
            </>
          }
        >
          <div
            id={'tableGenerateCrawlData'}
            className={cn(
              styles.row,
              { [styles.flex]: false },
              styles.overflow_scroll_but_hide_scrollbar,
            )}
          >
            <Table
              keywords={keywords}
              className={styles.table}
              setCountResult={setCountResult}
              setTypeFilter={setTypeFilter}
              setFileExport={setFileExport}
            ></Table>
          </div>
        </Card>
      </>
    </DataCrawledContext.Provider>
  );
}
