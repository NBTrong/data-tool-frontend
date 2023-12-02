import React, { useCallback, useMemo, useState } from 'react';

import cn from 'classnames';
import styles from './Row.module.sass';
import {
  badgeStatus,
  calculateTimeDifference,
  getParamFromStr,
  handleLongNumber,
  isValidHttpUrl,
  timestampToDate,
} from '../../../../utils/helpers';
import { Tooltip } from '../../../../components';
import { HiDotsHorizontal } from 'react-icons/hi';
import Popover from '../../../../components/Popover';
import Progress from '../../../../components/Progress';
import {
  MdDownloadForOffline,
  MdFileDownload,
  MdOutlineFileDownload,
  MdOutlineRunningWithErrors,
} from 'react-icons/md';
import { AiOutlineReload } from 'react-icons/ai';
import { BsFillStopCircleFill } from 'react-icons/bs';
import axios from 'axios';
import baseUrl from '../../../../services/config/baseUrl';
import Loading3Dots from '../../../../components/Loading3DotsNoAbsolute';
import LoadingCircle from '../../../../components/LoadingCircle';
import { RiListCheck } from 'react-icons/ri';
import { VscDebugContinue } from 'react-icons/vsc';

const statusReQueue = ['finished', 'failed', 'pause', 'stop'];
const statusStop = [
  'processing',
  'inqueue',
  'in queue',
  'created',
  'continue',
  'recheck',
  'in',
];
const statusReQueueErrorRows = ['finished'];
const statusShowDownload = ['finished', 'failed', 'stop', 'exporting'];
const statusShowContinue = ['stop'];

const Row = ({
  item,
  setIsConfirmMode,
  setActionSubmit,
  setFailedRows,
  setIsViewFailedRows,
}) => {
  const [isLoadingFailedRow, setIsLoadingFailedRow] = useState(false);

  const showModalFailedRows = useCallback((inputFile) => {
    setIsLoadingFailedRow(true);
    axios
      .get(baseUrl + `/queue/${inputFile.id}/failed-rows?tab=${inputFile.tab}`)
      .then((res) => {
        const rows = res.data.data;
        setFailedRows(rows);
        setIsViewFailedRows(true);
      })
      .catch((e) => {})
      .finally((r) => {
        setIsLoadingFailedRow(false);
      });
  }, []);

  const handleTypeName = (tab, query) => {
    if (tab?.includes('keyword-search-tracker')) {
      const country = getParamFromStr(query, 'country');
      const platform = getParamFromStr(query, 'platform');
      return `[${country}-${platform}] Keyword Search Tracker`;
    }
    if (tab === 'extract-data' || tab === 'videos-extract-data') {
      const isActiveDetectVoice = getParamFromStr(query, 'is_detect_voice');
      let language_code = getParamFromStr(query, 'language_code');
      language_code = language_code !== 'undefined' ? language_code : 'VI';
      return `${
        isActiveDetectVoice === 'true'
          ? `[Voice Detector-${language_code?.toUpperCase()}] `
          : ''
      } Video extract data`;
    }
    if (tab.includes('tiktok-channel-explore')) {
      const isHashtagMode = getParamFromStr(query, 'is_hashtag_mode') === '1';
      return `${
        isHashtagMode
          ? '[hashtags] Tiktok Channel Explore'
          : 'Tiktok Channel Explore'
      }`;
    }
    if (tab.includes('tiktok-keyword-explore')) {
      const isDurationMode = getParamFromStr(query, 'is_duration_mode') === '1';
      return `${
        isDurationMode
          ? '[duration] Tiktok Keyword Explore'
          : 'Tiktok Keyword Explore'
      }`;
    }
    return tab?.replaceAll('-', ' ');
  };

  const handleReQueue = useCallback((id) => {
    setIsConfirmMode(true);
    const status = 'created';
    const noti = 'Your file will be queued up and running again soon';
    setActionSubmit({ id, status, noti });
  }, []);

  const handleContinue = useCallback((id) => {
    setIsConfirmMode(true);
    const status = 'continue';
    const noti = 'Your file will be continue soon';
    setActionSubmit({ id, status, noti });
  }, []);

  const handleRecheck = useCallback((id) => {
    setIsConfirmMode(true);
    const status = 'recheck';
    const noti = 'Your file will soon be rerun with all failed rows';
    setActionSubmit({ id, status, noti });
  }, []);

  const handleStopQueue = useCallback((id, odl_status = '') => {
    setIsConfirmMode(true);
    let noti = 'Trying to kill process';
    if (odl_status === 'In queue') {
      noti = 'The process has stopped completely';
    }
    const status = 'stop';
    setActionSubmit({ id, status, noti });
  }, []);

  const getTooltip = useCallback((status) => {
    if (status === 'In queue') {
      return 'Your file has been queued and will start processing soon';
    }
    if (status === 'finished') {
      return 'Your file has been queued successfully';
    }
    if (status === 'stop') {
      return 'You have stopped this process. Press the re-queue button if you want to run it again';
    }
    if (status === 'failed') {
      return 'The file queue process raised an error and failed. We are trying to fix it';
    }
    if (status === 'processing') {
      return 'The file queue process is running';
    }
    if (status === 'continue') {
      return 'Your file is about to be played again';
    }
    if (status === 'recheck') {
      return 'Your file is about to be played again';
    }
  }, []);

  const getTooltipDownload = useCallback((status) => {
    if (status === 'finished') {
      return 'Download file result';
    }
    if (status === 'stop') {
      return 'This process has been forced to stop. The downloaded file will not have enough data';
    }
    if (status === 'failed') {
      return 'This process encountered an error during processing, the downloaded file may have errors and insufficient data';
    }
  }, []);

  const isShowTime = useCallback((item) => {
    return (
      item?.start_time &&
      (item?.status === 'processing' || item?.status === 'finished')
    );
  }, []);

  const downloadFiles = useCallback((str) => {
    try {
      const urls = JSON.parse(str);
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < urls.length) {
          const link = document.createElement('a');
          link.href = urls[index];

          // Tên file mới
          const fileName = `customFileName_${index + 1}.extension`; // Thay đổi tên file theo ý muốn

          link.download = fileName;
          link.click();
          index += 1;
        } else clearInterval(intervalId);
      }, 2000);
    } catch (e) {
      window.open(str, '_blank');
    }
  });

  const getStatusBadge = useCallback((status) => {
    if (status === 'finished') {
      return {
        backgroundColor: '#f0f6ed',
        border: '1px solid #83c06d !important',
        color: '#83c06d !important',
      };
    }
    if (status === 'failed') {
      return {
        backgroundColor: '#fdeceb',
        border: '1px solid #fa6754 !important',
        color: '#fa6754 !important',
      };
    }
    return {
      backgroundColor: '#9a9fa5',
      border: '1px solid #6f757e !important',
      color: '#6f757e !important',
    };
  }, []);

  const status = useMemo(() => {
    console.log(
      "item.status.split(' ')[0]?.toLowerCase();",
      item.status.split(' ')[0]?.toLowerCase(),
    );
    return item.status.split(' ')[0]?.toLowerCase();
  }, [item]);

  const numberStatus = useCallback(
    (status) => {
      switch (status) {
        case 'success':
          return 'status-green-2';
        case 'finished':
          return 'status-green-2';
        case 'processing':
          return 'status-yellow';
        case 'failed':
          return 'status-red';
        case 'stop':
          return 'status-dark';
        case 'exporting':
          return 'status-green-2';
        default:
          return 'status-default';
      }
    },
    [status],
  );

  const hasFailedRow = useMemo(() => {
    return item.row_count > item.total_success;
  }, [item]);

  return (
    <>
      <div className={cn(styles.row, `cursor-pointer`)}>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={cn(styles.text_gray)}>
            <Tooltip title={'Download your uploaded file'}>
              <a href={item?.url}>{item.name}</a>
            </Tooltip>
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={cn(styles.text_gray, 'text-capitalize')}>
            {handleTypeName(item?.tab, item?.query)}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={cn(styles.text_gray)}>
            {handleLongNumber(item?.row_count)}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={cn(styles.text_gray)}>
            {timestampToDate(item?.created_at)}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={cn(styles.text_gray)}>
            {item?.start_time ? timestampToDate(item?.start_time) : '--'}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div
            className={cn('text-nowrap badge fs-7', badgeStatus(status.trim()))}
          >
            <Tooltip title={getTooltip(item?.status)}>{item?.status}</Tooltip>
          </div>
        </div>
        {item?.status !== 'failed' ? (
          <>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <Progress
                percent={item?.progress}
                style={{ maxWidth: '150px', maxHeight: '12px' }}
                classNameParent={'justify-content-start'}
                isShowPercent={!!item?.progress}
              />
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <Tooltip title={'Click to show detail'}>
                {item.total_success &&
                  (!isLoadingFailedRow ? (
                    <div
                      onClick={() => {
                        showModalFailedRows(item);
                      }}
                      className={cn(styles.text_gray, 'text-nowrap')}
                    >
                      <div
                        className={cn(
                          badgeStatus('success'),
                          'd-flex justify-content-between align-items-center mb-2',
                        )}
                      >
                        Success{' '}
                        <span className={'status- ms-2'}>
                          {item.total_success}
                        </span>
                      </div>
                      <div
                        className={cn(
                          badgeStatus('failed'),
                          'd-flex justify-content-between align-items-center',
                        )}
                      >
                        Failed{' '}
                        <span className={'status-red ms-2'}>
                          {item.row_count - item.total_success}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="btn bg-transparent border-0 btn-sm"
                        type="button"
                        disabled
                      >
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </button>
                    </div>
                  ))}
              </Tooltip>
            </div>
            <div className={cn(styles.col, 'p-3 border-0')}>
              <div className={cn(styles.text_gray, 'text-nowrap')}>
                {isShowTime(item)
                  ? calculateTimeDifference(
                      (item?.status).trim() === 'finished'
                        ? item?.end_time || item?.updated_at
                        : new Date(),
                      item?.start_time,
                    )
                  : '--'}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={cn(styles.col, 'p-3 border-0 col')}>
              <div className={styles.text_gray}>
                The error has been identified, and our team is currently working
                on implementing a fix.
              </div>
            </div>
            <div className={cn(styles.col, 'p-3 border-0 col')}>--</div>
            <div className={cn(styles.col, 'p-3 border-0 col')}>--</div>
          </>
        )}
        {statusShowDownload.includes(status) && item?.result_url ? (
          <div className={cn(styles.col, 'p-3 border-0')}>
            <Tooltip title={getTooltipDownload(item?.status)}>
              <a
                onClick={() => downloadFiles(item?.result_url)}
                className={cn(
                  badgeStatus(status) + '-border',
                  'd-flex align-items-center py-2 border rounded-3',
                )}
              >
                <MdOutlineFileDownload
                  className={cn('fs-5 fw-light bg-transparent')}
                />
                <span
                  className={cn(
                    'logo-sm rounded-2 d-flex align-items-center justify-content-center ms-2',
                    numberStatus(item?.status),
                  )}
                >
                  {isValidHttpUrl(item?.result_url)
                    ? '1'
                    : JSON.parse(item?.result_url)?.length}
                </span>
              </a>
            </Tooltip>
          </div>
        ) : (
          <div className={cn(styles.col, 'p-3 border-0')}></div>
        )}
        <div className={styles.col}>
          <Popover
            bodyClass={'bg-hover-unset'}
            contents={[
              statusShowContinue.includes(status) && {
                component: (
                  <div
                    onClick={() => {
                      handleContinue(item?.id);
                    }}
                  >
                    <VscDebugContinue size={18} />
                    <span className={cn('ms-3')}>Continue</span>
                  </div>
                ),
              },
              statusReQueue.includes(status) && {
                component: (
                  <div
                    onClick={() => {
                      handleReQueue(item?.id);
                    }}
                  >
                    <AiOutlineReload size={18} />
                    <span className={cn('ms-3')}>Re-queue</span>
                  </div>
                ),
              },
              statusStop.includes(status) && {
                component: (
                  <div
                    onClick={() => {
                      handleStopQueue(item?.id);
                    }}
                  >
                    <BsFillStopCircleFill size={18} />
                    <span className={cn('ms-3')}>Stop</span>
                  </div>
                ),
              },

              statusReQueueErrorRows.includes(status) &&
                hasFailedRow && {
                  component: (
                    <div
                      onClick={() => {
                        handleRecheck(item?.id);
                      }}
                    >
                      <MdOutlineRunningWithErrors size={18} />
                      <span className={cn('ms-3')}>Rerun failed rows</span>
                    </div>
                  ),
                },
              statusReQueueErrorRows.includes(status) &&
                hasFailedRow && {
                  component: (
                    <div
                      onClick={() => {
                        showModalFailedRows(item);
                      }}
                    >
                      <RiListCheck size={18} />
                      <span className={cn('ms-3')}>View failed rows</span>
                    </div>
                  ),
                },
            ]}
          >
            <HiDotsHorizontal className={styles.btn} />
          </Popover>
        </div>
      </div>
    </>
  );
};

export default Row;
