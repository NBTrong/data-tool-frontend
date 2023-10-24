import React, {
  useState,
  createContext,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from 'react';

import cn from 'classnames';
import styles from './Content.module.sass';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {Card} from '../../components';

import Table from './Table';
import { AiOutlinePlus } from 'react-icons/ai/index';
import { BiDownload } from 'react-icons/bi/index';
import {
  exploringHtml,
  EXTRACT_DATA_EXCEL_TEMPLATE, getImageLoadingByPlatform, getPlatform,
  isValidHttpUrl, processFileToArray, uploadInputFile,
} from '../../utils/helpers';
import { exportExcelData } from './Export';
import { toast } from 'react-toastify';
import { GlobalShareContext } from '../../App';
import ConfirmEnqueue from "../../components/ConfirmEnqueue";

export const DataCrawledContext = createContext([]);

const cursorCommentPlush = 20;

const DEFAULT_NOTFOUND = {
  title: "Can't find this post",
  no_more_comments: true,
  comments: null
}

const AVAILABLE_PLATFORM = ['tiktok',"youtube"]

export default function Content() {
  const [fileData, setFileData] = useState([]);
  const [dataCrawled, setDataCrawled] = useState([]);
  const [isImportMode, setIsImportMode] = useState(false);
  const [isShowConfirmQueue, setIsShowConfirmQueue] = useState(false);
  const { globalShare, setGlobalShare } = useContext(GlobalShareContext);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keywordsDetectVoice, setKeywordsDetectVoice] = useState([]);
  const [maxCommentsCursor, setMaxCommentsCursor] = useState(20);
  const [activeCrawlComment, setActiveCrawlComment] = useState({});

  const handleCrawlAllPostComment = useCallback((url)=>{
    setActiveCrawlComment((prevData) => {
      const old = {...prevData};
      if (url !== undefined) old[url] = Infinity;
      return old;
    });
  },[])

  useEffect(() => {
    if (globalShare?.fileData?.length) {
      setFileData(globalShare.fileData);
      setGlobalShare({});
    }
  }, [globalShare]);

  // useEffect(() => {
  //   if (
  //     fileData.length &&
  //     dataCrawled.length === fileData.length &&
  //     isImportMode
  //   ) {
  //     toast.success('Finished extracting data successfully');
  //   }
  // }, [dataCrawled, isImportMode]);


  const filterData = useCallback((arr) => {
    const data = arr.flat(); // Không cần gọi filter(Boolean) ở đây
    let result = [];
    const uniqueItems = new Set();

    data.forEach((url) => {
      if (isValidHttpUrl(url)) {
        const platform = getPlatform(url);
        if (AVAILABLE_PLATFORM.includes(platform)){
          const image = getImageLoadingByPlatform(platform);
          const item = { url, platform, image };
          const itemString = JSON.stringify(item);

          if (!uniqueItems.has(itemString)) {
            uniqueItems.add(itemString);
            result.push(item);
          }
        }
      }
    });
    console.log("result",result)
    return result;
  },[]);


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
  }, [setFileData, filterData]);

  const handleCancelQueue = useCallback(async () => {
    const rows = await processFileToArray(file)
    setFileData(rows);
    setIsImportMode(true);
    setDataCrawled([]);
    setIsShowConfirmQueue(false)
  },[file])

  const handleConfirmQueue = useCallback(async () => {
    const rows = await processFileToArray(file)
    const rows_count = rows.length;
    const formData = new FormData();
    formData.append('file',file,file.name)
    const query = `&tab=comments-extract-data&row_count=${rows_count}&query=`
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

  const parseFileData = useMemo(() => {
    if (fileData && fileData.length) {
      const filteredData = filterData(fileData);
      if (!filteredData.length) {
        toast.error("Couldn't find any post url in the file");
      }
      return filteredData;
    }
    return [];
  }, [fileData]);

  const handleExportData = useCallback((e) => {
    e.preventDefault();
    exportExcelData(dataCrawled);
  },[dataCrawled]);

  const handleExportDemoExcelData = useCallback(() => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    EXTRACT_DATA_EXCEL_TEMPLATE.forEach((item) => {
      worksheet.addRow([item.column1]);
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'template-extract-data.xlsx');
    });
  }, []);

  const handleUploadFileEvent = (e) => {
    e.preventDefault();
    readExcelFile();
  };


  const handlePushDataCrawled = useCallback((newData,index = undefined) => {
    setDataCrawled((prev) => {
      if (index !== undefined){
        const old = [...prev];
        old[index] = newData;
        return old
      }
      return dataCrawled.concat(newData)
    });
  },[dataCrawled])

  useEffect(()=>{
    setDataCrawled(parseFileData)
  },[parseFileData])

  const handleSetComments = useCallback((url,comments,index=false,isNull = false,hasMore=true) => {
    setDataCrawled((prevData) => {
      const newDataCrawled = [...prevData];

      if (index !== undefined){
        if (!hasMore){
          newDataCrawled[index].no_more_comments = true;
        }
        if (isNull){
          newDataCrawled[index].comments = null;
        } else {
          if (newDataCrawled[index].comments){
            newDataCrawled[index].comments.push(...comments)
          } else {
            newDataCrawled[index].comments = comments
          }
        }
      }


      return newDataCrawled
    });
  },[dataCrawled])


  const handleSetCommentReplies = useCallback(({replies,indexPost=false,indexComment,noMore=false}) => {
    setDataCrawled((prevData) => {
      const newDataCrawled = [...prevData];
      if (indexPost !== undefined && indexComment !== undefined){
        newDataCrawled[indexPost].comments[indexComment].replies.push(...replies)
      }
      if(noMore){
        newDataCrawled[indexPost].comments[indexComment].no_more_replies = true
      }
      return newDataCrawled
    });
  },[dataCrawled])

  useEffect(()=>{
    if (fileData.length){
      handleActiveCrawlComment();
    }
  },[parseFileData])

  const handleActiveCrawlComment = useCallback((url="",active=true) =>{
    let obj = {};
    if (url){
      obj = [...parseFileData];
      obj[url] = active;
    } else {
      parseFileData.forEach(({url: i})=>{
        if (url){
          obj[i] = url === i ? active : !active;
        } else {
          obj[i] = active
        }
      })
    }
    console.log("active comment",obj)
    setActiveCrawlComment(obj)
  },[parseFileData])


  return (
    <DataCrawledContext.Provider value={{ DEFAULT_NOTFOUND,cursorCommentPlush,dataCrawled, setDataCrawled,handleSetComments,maxCursor: maxCommentsCursor,handlePushDataCrawled,handleActiveCrawlComment,activeCrawlComment,handleSetCommentReplies,handleCrawlAllPostComment,setMaxCommentsCursor }}>
      <>
        <ConfirmEnqueue
            isLoading={isLoading}
            isShowConfirmQueue={isShowConfirmQueue}
            setIsShowConfirmQueue={setIsShowConfirmQueue}
            handleConfirmQueue={handleConfirmQueue}
            handleCancelQueue={handleCancelQueue}
        />
        <div className={'mb-4 d-flex align-items-center'}>
          <button
            className={cn(
              'button-small fs-mobile py-sm-4 text-nowrap border opacity-75 px-md-4 py-1 px-2',
              styles.btnAdd,
            )}
            onClick={handleUploadFileEvent}
          >
            <AiOutlinePlus className={cn(styles.icon)} />
            Upload File (Excel)
          </button>
          <button
            className={cn(
              styles.btnExport,
              'button-small text-black fw-bold bg-white d-flex align-items-center fs-mobile py-sm-4 text-nowrap px-md-4 py-1 px-2',
            )}
            onClick={handleExportDemoExcelData}
          >
            <BiDownload className={cn(styles.icon, 'ms-0 me-2 mb-0')} />
            Download Template
          </button>
        </div>
        <Card
          id={'extractCard'}
          className={cn(styles.card, 'min-h-screen')}
          title={`${parseFileData?.length ? dataCrawled?.length + '/' : ''}${parseFileData?.length}` + ' Posts' + (dataCrawled?.length !== parseFileData?.length ? exploringHtml() : '')}
          classTitle={cn('title-purple text-nowrap', styles.title)}
          classCardHead={cn(
            styles.head,
            { [styles.hidden]: false },
            'flex-nowrap align-items-center',
          )}
          head={
            <>
              <div
                className={
                  'w-100 d-flex justify-content-between align-items-center'
                }
              >
                <div></div>
                <button
                    className={cn(
                        styles.link,
                        styles.btnExport,
                        'm-0 fs-mobile px-2 py-md-2 py-1 px-md-3 d-flex align-items-center',
                    )}
                    onClick={handleExportData}
                >
                  Download (Excel)
                  <BiDownload className={cn(styles.icon, 'mb-0 ms-2')} />
                </button>
              </div>
            </>
          }
        >
          <div
            id={'tableGenerateCrawlData'}
            className={cn(
              styles.row,
              { [styles.flex]: false },
            )}
          >
            <Table
              fileData={parseFileData}
              setFileData={setFileData}
              setKeywordsDetectVoice={setKeywordsDetectVoice}
            ></Table>
          </div>
        </Card>
      </>
    </DataCrawledContext.Provider>
  );
}
