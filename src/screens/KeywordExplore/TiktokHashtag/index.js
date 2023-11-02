import React, {useState, createContext, useCallback, useMemo,useEffect} from 'react';

import cn from 'classnames';
import styles from './Content.module.sass';
import * as XLSX from 'xlsx';
import {Card, Modal} from '../../../components';
import { saveAs } from 'file-saver';

import Table from './Table';
import FiltersForm from './Filters';
import { AiOutlinePlus } from 'react-icons/ai/index';
import { BiDownload } from 'react-icons/bi/index';
import SearchInput from './SearchInput';
import { exportExcelData } from './Export/export';
import Filters from '../../../components/Filters';
import {
  KEYWORD_EXPLORE_EXCEL_TEMPLATE,
  processFileToArray,
  stringToTimestamp,
  uploadInputFile
} from "../../../utils/helpers";
import {toast} from "react-toastify";
import SubmitModal from "../../../components/SubmitModal";
import useQueryString from "../../../hooks/useQueryString";
import ExcelJS from "exceljs";

export const DataCrawledContext = createContext([]);

export default function KeywordExplore() {
  const [searchValues, setSearchValues] = useState([]);
  const [typeFilter, setTypeFilter] = useState('post');
  const [fileExport, setFileExport] = useState([]);
  const [dataCrawled, setDataCrawled] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [countResult, setCountResult] = useState('0 Result');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowConfirmQueue, setIsShowConfirmQueue] = useState(false);
  const {queryString, setQueryString} = useQueryString();
  const {publish_time} = queryString;

  const isDisabled = useMemo(()=>{
    return !!keywords?.find(i=>i?.text?.includes("#"))
  },[keywords])

  const filterData = useCallback((arr) => {
    const rowFirstColumn = arr.map(i=>{
      i.length = 1;
      return i
    })
    return rowFirstColumn
        .flatMap((item) => item.filter((i)=>{
          return Boolean(i) && i !== "Keyword/hashtag" && i !== "Start time" && i !== "End time"
        }))
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
      setFile(file);
      setIsShowConfirmQueue(true)
    };

    inputElement.click();
  }, []);

  const handleCancelQueue = useCallback(async () => {
    setIsShowConfirmQueue(false)
    const rows = await processFileToArray(file)

    const reQueryString = {...queryString}

    if (rows[0][1] === "Start time" && rows[0][2] === "End time"){
      reQueryString.from = stringToTimestamp(rows[1][1]) / 1000
      reQueryString.to = stringToTimestamp(rows[1][2]) / 1000
    }

    setQueryString(reQueryString);

    const filteredData = filterData(rows);
    setSearchValues(filteredData);
  },[file,queryString])

  const handleConfirmQueue = useCallback(async () => {
    const rows = await processFileToArray(file)
    const rows_count = rows.length;
    const formData = new FormData();
    formData.append('file',file,file.name)
    const query = `&tab=tiktok-keyword-explore&row_count=${rows_count}&query=${encodeURIComponent(`&publish_time=${publish_time || 0}`)}`
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
  },[file,publish_time])

  const handleUploadFileExcel = (e) => {
    e.preventDefault();
    readExcelFile();
  };

  const handleExportData = (e) => {
    e.preventDefault();
    exportExcelData(fileExport, typeFilter);
  };

  const handleExportDemoExcelData = useCallback(() => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    KEYWORD_EXPLORE_EXCEL_TEMPLATE.forEach((item) => {
      worksheet.addRow([item.column1]);
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'keyword-explore-template.xlsx');
    });
  }, []);

  return (
    <DataCrawledContext.Provider value={{ dataCrawled, setDataCrawled }}>
      <>
        <Modal
            visible={isShowConfirmQueue}
            onClose={() => setIsShowConfirmQueue(false)}
        >
          <SubmitModal
              title={'Enqueue file'}
              contentBtnSubmit={'Put in queue\n'}
              contentBtnCancel={'Use preview'}
              isLoading={isLoading}
              onClose={async () => {
                await handleCancelQueue()
              }}
              content={`
                  <b>Do you want to put this file in the queue (Increase speed, increase accuracy and file will be saved but not preview directly).</b>
                  <br>
                  <div class="lh-sm mt-2"><small>* Note: Using the preview should only return the number of results from 10k-20k posts depending on your computer.
                  Should use Queue if keywords contains a large number of posts</small></div>`}
              handleSubmit={async () => {
                await handleConfirmQueue();
              }}
          />
        </Modal>
        <div
          className={'mb-4 d-flex align-items-center justify-content-between'}
        >
          <div className={'me-5'}>
            <SearchInput
              onInputChange={setKeywords}
              searchValues={searchValues}
            />
          </div>
          <div className={'d-flex align-items-center'}>
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
            <button
                className={cn(
                    styles.btnExport,
                    'button-small text-black fw-bold bg-white d-flex align-items-center fs-mobile py-sm-4 text-nowrap px-md-4 py-1 px-2 ms-1 ms-md-2',
                )}
                onClick={handleExportDemoExcelData}
            >
              <BiDownload className={cn(styles.icon, 'ms-0 me-2 mb-0')} />
              Download Template
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
                  <FiltersForm isDisabled={isDisabled}/>
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
