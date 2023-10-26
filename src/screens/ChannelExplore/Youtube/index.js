import React, { useState, createContext, useCallback } from 'react';

import cn from 'classnames';
import styles from './Content.module.sass';
import * as XLSX from 'xlsx';
import { Card } from '../../../components';
import Filters from '../../../components/Filters';
import FiltersForm from './Filters';

import Table from './Table';
import { AiOutlinePlus } from 'react-icons/ai/index';
import { BiDownload } from 'react-icons/bi/index';
import SearchInput from './SearchInput';
import { exportExcelData } from './Export/export';
import {processFileToArray, uploadInputFile} from "../../../utils/helpers";
import {toast} from "react-toastify";
import ConfirmEnqueue from "../../../components/ConfirmEnqueue";

export const DataCrawledContext = createContext({ post: [], KOC: [] });

export default function KeywordExplore() {
  const [searchValues, setSearchValues] = useState([]);
  const [fileExport, setFileExport] = useState([]);
  const [typeFilter, setTypeFilter] = useState('post');
  const [dataCrawled, setDataCrawled] = useState({ post: [], KOC: [] });
  const [keywords, setKeywords] = useState([]);
  const [countResult, setCountResult] = useState('0 Result');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowConfirmQueue, setIsShowConfirmQueue] = useState(false);

  const filterData = (arr) => {
    return arr
      .flatMap((item) => item.filter(Boolean))
      .map((item, index) => {
        return {
          id: index + 1 + '',
          text: item,
        };
      });
  };

  const readExcelFile = useCallback(() => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.xlsx';

    inputElement.onchange = async () => {
      const file = inputElement.files[0];
      setFile(file);
      setIsShowConfirmQueue(true)
    };

    inputElement.click();
  });

  const handleCancelQueue = useCallback(async () => {
    setIsShowConfirmQueue(false)
    const rows = await processFileToArray(file)
    const filteredData = filterData(rows);
    setSearchValues(filteredData);
  },[file])

  const handleConfirmQueue = useCallback(async () => {
    const rows = await processFileToArray(file)
    const rows_count = rows.length;
    const formData = new FormData();
    formData.append('file',file,file.name)
    const query = `&tab=youtube-channel-explore&row_count=${rows_count}&query=`
    setIsLoading(true);
    uploadInputFile({formData,query},()=>{
      toast.success('The file has been uploaded successfully, you can see the progress in the Queue tab')
      setIsLoading(false);
      setIsShowConfirmQueue(false)
    },()=>{
      setIsLoading(false);
      setIsShowConfirmQueue(false)
      toast.error('Something went wrong, we\'re trying to fix it')
    })
  },[file])

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
        <ConfirmEnqueue
            isLoading={isLoading}
            isShowConfirmQueue={isShowConfirmQueue}
            setIsShowConfirmQueue={setIsShowConfirmQueue}
            handleConfirmQueue={handleConfirmQueue}
            handleCancelQueue={handleCancelQueue}
        />
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
              Upload Channel URL (URL)
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
