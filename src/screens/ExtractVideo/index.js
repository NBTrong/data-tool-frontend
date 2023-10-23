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
import { Card, Modal } from '../../components';

import Table from './Table';
import { AiOutlinePlus } from 'react-icons/ai/index';
import { BiDownload } from 'react-icons/bi/index';
import {
  exploringHtml,
  EXTRACT_DATA_EXCEL_TEMPLATE, getPlatform,
  isValidHttpUrl, processFileToArray,
  stringToTimestamp, uploadInputFile,
} from '../../utils/helpers';
import { exportExcelData } from './Export';
import ConfirmContentWithInput from '../../components/ConfirmContentWithInput';
import { toast } from 'react-toastify';
import { addCampaignSchema } from '../../utils/ValidateSchema';
import axios from 'axios';
import { GlobalShareContext } from '../../App';
import baseUrl from '../../services/config/baseUrl';
import ConfirmEnqueue from "../../components/ConfirmEnqueue";
import useQueryString from "../../hooks/useQueryString";

const AVAILABLE_DETECT_VOICE = ["tiktok", "youtube"]

export const DataCrawledContext = createContext([]);

export default function Content() {
  const [fileData, setFileData] = useState([]);
  const [dataCrawled, setDataCrawled] = useState([]);
  const [countRow, setCountRow] = useState(0);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [isImportMode, setIsImportMode] = useState(false);
  const [isShowConfirmQueue, setIsShowConfirmQueue] = useState(false);
  const { globalShare, setGlobalShare } = useContext(GlobalShareContext);
  const { queryString } = useQueryString();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDetectVoice, setActiveDetectVoice] = useState(false);
  const [keywordsDetectVoice, setKeywordsDetectVoice] = useState([]);

  useEffect(() => {
    if (globalShare?.fileData?.length) {
      setFileData(globalShare.fileData);
      setCampaign(globalShare.campaign);
      setGlobalShare({});
    }
  }, [globalShare]);
  const parseCampaign = (dataCrawled) => {
    const result = {
      name: campaign,
      platforms: [],
      total_contents: dataCrawled.length,
      total_comments: 0,
      total_views: 0,
      total_shares: 0,
      total_saves: 0,
      total_likes: 0,
      contents: [],
    };
    dataCrawled.forEach((data) => {
      if (data?.platform && !result.platforms.includes(data?.platform)) {
        result.platforms.push(data.platform);
      }
      if (data.statistics) {
        result.total_comments += Number(data.statistics.comment_count);
        result.total_views += Number(data.statistics.view_count);
        result.total_likes += Number(data.statistics.like_count);
        result.total_shares += Number(data.statistics.share_count);
        result.total_saves += Number(data.statistics.save_count);
      }
      result.contents.push({
        post_url: data?.url,
        platform: data?.platform,
        thumb_url: data?.thumb_url,
        title: data?.title,
        campaign_id: 0,
        total_comments: Number(data?.statistics?.comment_count ?? 0),
        total_views: Number(data?.statistics?.view_count ?? 0),
        total_likes: Number(data?.statistics?.like_count ?? 0),
        total_shares: Number(data?.statistics?.share_count ?? 0),
        total_saves: Number(data?.statistics?.save_count ?? 0),
        uploaded_time: stringToTimestamp(data?.created_at ?? 0),
      });
    });
    result.platforms = result.platforms.join(',');
    return result;
  };

  const handleUploadCampaign = useCallback(() => {
    const body = parseCampaign(dataCrawled);
    axios.post(baseUrl + '/campaigns', body).then((r) => {
      toast.success('File has been saved as campaign');
    });
  }, [dataCrawled]);

  useEffect(() => {
    if (
      fileData.length &&
      dataCrawled.length === fileData.length &&
      isImportMode
    ) {
      toast.success('Finished extracting data successfully');
    }
  }, [dataCrawled, isImportMode]);

  useEffect(() => {
    if (
      campaign &&
      campaign.length &&
      dataCrawled.length &&
      dataCrawled.length === fileData.length
    ) {
      handleUploadCampaign();
    }
  }, [campaign, dataCrawled]);

  const filterData = useCallback((arr) => {
    const data = arr.flat(); // Không cần gọi filter(Boolean) ở đây
    let result = [];
    const uniqueItems = new Set();

    data.forEach((url) => {
      if (isValidHttpUrl(url)) {
        const platform = getPlatform(url);
        const image = getImageLoadingByPlatform(platform);
        const item = { url, platform, image };
        const itemString = JSON.stringify(item);

        if (!uniqueItems.has(itemString)) {
          uniqueItems.add(itemString);
          result.push(item);
        }
      }
    });

    return result;
  }, []);

  const getImageLoadingByPlatform = (platform) => {
    if (platform === 'tiktok') {
      return '/images/content/tiktok.gif';
    }
    if (platform === 'youtube') {
      return '/images/content/youtube.png';
    }
    if (platform === 'instagram') {
      return '/images/content/instagram.png';
    }
  };

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
    setIsShowConfirmQueue(false);
    setDataCrawled([]);
  }, [file])

  const handleConfirmQueue = useCallback(async () => {
    const rows = await processFileToArray(file)
    const rows_count = rows.length;
    const formData = new FormData();
    formData.append('file', file, file.name)
    const query = `&tab=videos-extract-data&row_count=${rows_count}&query=${encodeURIComponent(`&language_code=${queryString?.language_code}&is_detect_voice=${activeDetectVoice}&keywords=${keywordsDetectVoice.map(({ text }) => text)}`)}`
    setIsLoading(true);
    uploadInputFile({ formData, query }, () => {
      toast.success('The file has been uploaded successfully, you can see the progress in the Queue tab')
      setIsLoading(false);
      setIsShowConfirmQueue(false)
    }, () => {
      setIsLoading(false);
      setIsShowConfirmQueue(false)
      toast.error('Something went wrong, we\'re trying to fix it')
    })
  }, [file, activeDetectVoice])

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
    exportExcelData(dataCrawled, activeDetectVoice, keywordsDetectVoice);
  }, [dataCrawled, activeDetectVoice]);

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

  const handlePushDataCrawled = useCallback((newData) => {
    setDataCrawled(() => dataCrawled.concat(newData));
  }, [dataCrawled])

  const handleSetTranscript = useCallback((url, dataTranscript) => {
    setDataCrawled((prevData) => {
      const newDataCrawled = [...prevData];

      for (let i = 0; i < newDataCrawled.length; i++) {
        if (newDataCrawled[i].url === url) {
          newDataCrawled[i] = {
            ...newDataCrawled[i],
            ...dataTranscript
          };
        }
      }

      return newDataCrawled
    });
  }, [dataCrawled])

  return (
    <DataCrawledContext.Provider value={{ dataCrawled, setDataCrawled, handlePushDataCrawled, handleSetTranscript, activeDetectVoice, AVAILABLE_DETECT_VOICE }}>
      <>
        <ConfirmEnqueue
          isLoading={isLoading}
          isShowConfirmQueue={isShowConfirmQueue}
          setIsShowConfirmQueue={setIsShowConfirmQueue}
          handleConfirmQueue={handleConfirmQueue}
          handleCancelQueue={handleCancelQueue}
        />
        <Modal visible={isConfirmMode} onClose={() => setIsConfirmMode(false)}>
          {/* <ConfirmContentWithInput
            title="Confirm"
            content="Do you want to save this file as a <b>Campaign</b>?"
            inputLabel="Campaign Name"
            inputPlaceholder="Ex: March 8th 2023"
            inputName="name"
            contentBtnSubmit="Save"
            contentBtnCancel="Skip"
            validate={addCampaignSchema}
            onClose={() => handleSkipMode()}
            handleSubmit={(event) => handleSaveMode(event)}
          /> */}
        </Modal>
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
          title={`${fileData.length ? dataCrawled.length + '/' : ''}${countRow}` + ' Rows' + (dataCrawled.length !== parseFileData.length ? exploringHtml() : '')}
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
                <div className={'d-flex'}>
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
              className={styles.table}
              fileData={parseFileData}
              setCountRow={setCountRow}
              setFileData={setFileData}
              setKeywordsDetectVoice={setKeywordsDetectVoice}
            ></Table>
          </div>
        </Card>
      </>
    </DataCrawledContext.Provider>
  );
}
