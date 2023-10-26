import React, {useState, createContext, useCallback, useEffect} from 'react';

import cn from 'classnames';
import styles from './Content.module.sass';
import * as XLSX from 'xlsx';
import {Card, Modal} from '../../../components';
import Filters from '../../../components/Filters';
import FiltersForm from './Filters';
import { saveAs } from 'file-saver';

import Table from './Table';
import { AiOutlinePlus } from 'react-icons/ai/index';
import { BiDownload } from 'react-icons/bi/index';
import SearchInput from './SearchInput';
import { exportExcelData } from './Export/export';
import {
  CHANNEL_EXPLORE_EXCEL_TEMPLATE,
  EXTRACT_DATA_EXCEL_TEMPLATE,
  processFileToArray, stringToTimestamp,
  uploadInputFile
} from "../../../utils/helpers";
import {toast} from "react-toastify";
import SubmitModal from "../../../components/SubmitModal";
import ConfirmEnqueue from "../../../components/ConfirmEnqueue";
import ExcelJS from "exceljs";
import useQueryString from "../../../hooks/useQueryString";

export const DataCrawledContext = createContext([]);

export default function KeywordExplore() {
  const [searchValues, setSearchValues] = useState([]);
  const [fileExport, setFileExport] = useState([]);
  const [typeFilter, setTypeFilter] = useState('post');
  const [dataCrawled, setDataCrawled] = useState([]);
  const [keywords, setKeywords] = useState([]);
  // const [isNeedRewriteDataCrawled, setIsNeedRewriteDataCrawled] = useState(false);
  const [countResult, setCountResult] = useState('0 Result');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowConfirmQueue, setIsShowConfirmQueue] = useState(false);
  const {queryString, setQueryString} = useQueryString();
  const {hashtags,from,to} = queryString;
  const filterData = (arr) => {
    const rowFirstColumn = arr.map(i=>{
      i.length = 1;
      return i
    })
    return rowFirstColumn
      .flatMap((item) => item.filter((i)=>{
        return Boolean(i) && i !== "KOC" && i !== "HASHTAGS"
      }))
      .map((item, index) => {
        return {
          id: index + 1 + '',
          text: item,
        };
      });
  };
  //
  // useEffect(()=>{
  //   setIsNeedRewriteDataCrawled(true)
  // },[keywords])
  //
  // useEffect(()=>{
  //   if (isNeedRewriteDataCrawled){
  //     setIsNeedRewriteDataCrawled(false);
  //     const keywordTexts = keywords.map(i=>i.text);
  //     const rewriteData = dataCrawled.filter((i)=>{
  //       return keywordTexts?.includes(i?.keyword);
  //     })
  //     setDataCrawled(rewriteData);
  //   }
  // },[isNeedRewriteDataCrawled,dataCrawled,keywords])

  const removeKeyword = useCallback((keyword) => {
    const rewrite = keywords.filter(key=>key.text !== keyword);
    setKeywords(rewrite)
    setSearchValues(rewrite)
  },[keywords])
  //
  // const retryKeyword = useCallback((keyword) => {
  //   const old = keywords;
  //   const rewrite = keywords.filter(key=>key.text !== keyword);
  //   setKeywords(rewrite)
  //   setSearchValues(rewrite)
  //   setTimeout(function () {
  //     setKeywords(old)
  //     setSearchValues(old)
  //   },100)
  // },[keywords])

  const readExcelFile = useCallback(() => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.xlsx';

    inputElement.onchange = async () => {
      const file = inputElement.files[0];
      setFile(file)
      setIsShowConfirmQueue(true)
    };

    inputElement.click();
  });

  const handleCancelQueue = useCallback(async () => {
    setIsShowConfirmQueue(false)
    const rows = await processFileToArray(file)

    const reQueryString = {...queryString}
    console.log("rows[0]",rows[1])
    if (rows[0][1] === "hashtags"){
      reQueryString.hashtags = rows[1][1]
    }

    if (rows[0][2] === "duration start" && rows[0][3] === "duration end"){
      reQueryString.from = stringToTimestamp(rows[1][2]) / 1000
      reQueryString.to = stringToTimestamp(rows[1][3]) / 1000
    }
    setQueryString(reQueryString);
    const filteredData = filterData(rows);

    console.log("filteredData",filteredData)

    setSearchValues(filteredData);
  },[file,queryString])

  const handleConfirmQueue = useCallback(async () => {
    const rows = await processFileToArray(file)
    const isHashtagMode = rows[0][1]?.toLowerCase() === "hashtags"
    const rows_count = rows.length;
    const formData = new FormData();
    formData.append('file',file,file.name)
    const query = `&tab=tiktok-channel-explore&row_count=${rows_count}&query=${encodeURIComponent(`&is_hashtag_mode=${Number(isHashtagMode)}`)}`
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
    CHANNEL_EXPLORE_EXCEL_TEMPLATE.forEach((item) => {
      worksheet.addRow([item.column1,item?.column2]);
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'channel-explore-template.xlsx');
    });
  }, []);
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
          <div className={'d-flex align-items-center'}>
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
              removeKeyword={removeKeyword}
              // retryKeyword={retryKeyword}
            ></Table>
          </div>
        </Card>
      </>
    </DataCrawledContext.Provider>
  );
}
