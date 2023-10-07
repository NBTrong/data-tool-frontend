import moment from 'moment';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import axios from 'axios';
import baseUrl from '../services/config/baseUrl';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function fromNow(date) {
  return moment(date).fromNow();
}

export function dateToUrl(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  return formattedDate;
}

export const EXTRACT_DATA_EXCEL_TEMPLATE = [
  {
    column1: 'https://www.tiktok.com/@maybelline_vn/video/7206190884549012762',
  },
  {
    column1: 'https://www.tiktok.com/@maybelline_vn/video/7204359189995457818',
  },
  {
    column1: 'https://www.tiktok.com/@maybelline_vn/video/7201502823979224346',
  },
  { column1: 'https://www.youtube.com/watch?v=97JmqgQOMBg&t=6s' },
  { column1: 'https://www.youtube.com/shorts/073tFSShCP0' },
  { column1: 'https://www.youtube.com/watch?v=6zIbfK9nqdc' },
  { column1: 'https://www.instagram.com/p/CpHAqn8tIs8/' },
  { column1: 'https://www.instagram.com/p/CsXJCqxL8ZF/' },
];

export const CHANNEL_EXPLORE_EXCEL_TEMPLATE = [
  {
    column1: 'KOC',
    column2: 'Hashtags',
  },
  {
    column1: 'https://www.tiktok.com/@maybelline_vn/',
    column2: '#maybelline_vn,#loreal,#lorealparis_vn',
  },
  {
    column1: 'https://www.tiktok.com/@lorealparis_vn/',
  },
  {
    column1: 'https://www.tiktok.com/@lorealparis_vn/',
  },
];

export const KEYWORD_EXPLORE_EXCEL_TEMPLATE = [
  {
    column1: 'Keyword/hashtag',
  },
  {
    column1: '#thuvienmakeup',
  },
  {
    column1: 'maybelline',
  },
];
export const KEYWORD_TRACKER_EXCEL_TEMPLATE = [
  {
    column1: 'maybelline',
  },
  {
    column1: 'son môi',
  },
  {
    column1: 'sữa rửa mặt',
  },
  { column1: 'tẩy trang' },
  { column1: 'sữa tắm' },
];

export const CATEGORY_SUGGESTION_EXCEL_TEMPLATE = [
  {
    column1: 'kem chống nắng la roche posay',
  },
  {
    column1: 'kem chống nắng anessa',
  },
  {
    column1: 'kem chống nắng skin aqua',
  },
  {
    column1: 'kem chông nắng anessa',
  },
  {
    column1: 'bộ cọ makeup',
  },
  {
    column1: 'trang điểm nhẹ nhàng tự nhiên',
  },
  {
    column1: 'kem lót bb',
  },
  {
    column1: 'cọ bobbi brown',
  },
  {
    column1: 'kem chống nắng vichy',
  },
  {
    column1: 'kem chống nắng cho da dầu mụn',
  },
  {
    column1: 'gia công son môi',
  },
  {
    column1: 'dưỡng môi vaseline',
  },
  {
    column1: 'trị thâm môi',
  },
  {
    column1: 'găng tay chống nắng',
  },
  {
    column1: 'gang tay chống nắng',
  },
  {
    column1: 'kem chống nắng avène',
  },
  {
    column1: 'kem chống nắng eucerin',
  },
  {
    column1: 'kem chống nắng sunplay',
  },
  {
    column1: 'kem chống nắng body',
  },
  {
    column1: 'kem chống nắng heliocare',
  },
  {
    column1: 'chống nắng',
  },
  {
    column1: 'kem chống nắng biore',
  },
  {
    column1: 'la roche posay kem chống nắng',
  },
  {
    column1: 'xịt chống nắng',
  },
  {
    column1: 'kcn martiderm',
  },
  {
    column1: 'chóng nắng',
  },
  {
    column1: 'kem chống nắng image',
  },
  {
    column1: 'kem chống nắng vật lý',
  },
  {
    column1: 'kem chống nắng dbh',
  },
  {
    column1: 'kem chống nắng fixderma',
  },
  {
    column1: 'kem chống nắng shadow',
  },
  {
    column1: 'kem chống nắng the saem',
  },
  {
    column1: 'kem chống nắng neutrogena',
  },
  {
    column1: 'kem chống nắng cho da nhạy cảm',
  },
  {
    column1: 'kem nền fenty beauty',
  },
  {
    column1: 'kem lót và kem nền',
  },
  {
    column1: 'vaseline dưỡng môi trị thâm',
  },
  {
    column1: 'vaseline dưỡng môi 7g giá bảo nhiều',
  },
  {
    column1: 'srm bioderma xanh',
  },
  {
    column1: 'sửa rửa mặt loreal',
  },
  {
    column1: 'svr srm',
  },
  {
    column1: 'srm derladie',
  },
  {
    column1: 'kem forencos tím',
  },
  {
    column1: 'kem dưỡng thể vaseline',
  },
  {
    column1: 'kem transino',
  },
  {
    column1: 'dưỡng thể nivea',
  },
  {
    column1: 'dầu gội tsubaki',
  },
  {
    column1: 'dau goi phu bac sin hair',
  },
  {
    column1: 'dầu gội bửoi',
  },
  {
    column1: 'dàu dưỡng tóc',
  },
  {
    column1: 'kem dưỡng thể vaseline',
  },
  {
    column1: 'dầu gội rejoice',
  },
  {
    column1: 'dưỡng thể nivea',
  },
  {
    column1: 'dầu xả rejoice',
  },
  {
    column1: 'dầu gội sunsilk vàng',
  },
];

export function timestampToDate(unix_timestamp, format = 'all-unit') {
  const dateFormat = new Date(
    parseInt(unix_timestamp) > 1000000000
      ? unix_timestamp * 1000
      : unix_timestamp,
  );
  let options;
  if (format === 'all-unit') {
    options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  }
  if (format === 'date') {
    options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  }
  return dateFormat.toLocaleDateString('en-US', options);
}

export function removeSpecialCharacters(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

export function convertToDateFormat(timeStr) {
  const year = timeStr.slice(0, 4);
  const month = timeStr.slice(4, 6);
  const day = timeStr.slice(6, 8);

  return `${year}-${month}-${day}`;
}

export function handleLongNumber(number, type = 'all') {
  if (isNaN(parseInt(number))) {
    return number;
  }
  let obj = { number, text: '' };
  if (number > 1000000) {
    obj = { number: (number / 1000000).toFixed(1), text: 'M' };
  }
  if (number > 1000) {
    obj = { number: (number / 1000).toFixed(1), text: 'K' };
  }
  switch (type) {
    case 'all':
      return obj.number + obj.text;
    case 'number':
      return obj.number;
    case 'text':
      return obj.text;
    default:
      return obj.number + obj.text;
  }
}

export function stringToTimestamp(timeString) {
  if (Number(timeString)) return timeString;
  const date = new Date(timeString);
  return date.getTime();
}

export function getUrlFromString(url, config = ['origin', 'pathname']) {
  const format = new URL(url);
  return config.map((key) => format[key]).join('');
}

export function convertToSlug(slug, join = '-') {
  slug = slug.toLowerCase();
  slug = slug.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  slug = slug.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  slug = slug.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  slug = slug.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  slug = slug.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  slug = slug.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  slug = slug.replace(/(đ)/g, 'd');
  slug = slug.replace(/([^0-9a-z-\s])/g, '');
  slug = slug.replace(/(\s+)/g, join);
  slug = slug.replace(/^-+/g, '');
  slug = slug.replace(/-+$/g, '');
  return slug;
}

export function checkArraysEquality(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  const sortedArray1 = array1.slice().sort();
  const sortedArray2 = array2.slice().sort();

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }

  return true;
}

export function removeSpaces(str) {
  return str.replace(/\s/g, '');
}

export function getRemainingElementPositions(arr, excludedElements) {
  const positions = [];

  for (let i = 0; i < arr.length; i++) {
    if (!excludedElements.includes(arr[i])) {
      positions.push(i);
    }
  }

  return positions;
}

export function changeIndexToTop(arr, top) {
  const table = arr;
  const columnIndex = table[0].indexOf(top);

  if (columnIndex > 0) {
    // Hoán đổi vị trí của cột
    table[0][columnIndex] = table[0][0];
    table[0][0] = top;

    for (let i = 1; i < table.length; i++) {
      const temp = table[i][0];
      table[i][0] = table[i][columnIndex];
      table[i][columnIndex] = temp;
    }
  }

  return table;
}

export function getModelStatus(status, model) {
  if (!status) {
    return 'available';
  }
  if (
    status === 'succeeded' ||
    status === 'created' ||
    status.includes('cancelled')
  ) {
    return 'available';
  }
  if (status.includes('failed')) {
    return 'failed';
  }
  return 'training';
}

export function getModelStatusText(str) {
  const status = getModelStatus(str);
  if (status === 'available') {
    return '';
  }
  if (status === 'failed') {
    return " <span class='badge bg-danger ms-2 opacity-50' style='height: 19px'>Training failed</span>";
  }
  return " <span class='badge bg-secondary ms-2 opacity-50' style='height: 19px'>Training</span>";
}

export function removeDuplicatesByProperty(arr, prop) {
  const uniqueValues = new Map();
  return arr.filter((item) => {
    if (uniqueValues.has(item[prop])) {
      return false;
    }
    uniqueValues.set(item[prop], true);
    return true;
  });
}

export function handleSeeMore(
  self,
  content,
  className = 'text-gray fw-semibold',
) {
  const newHTML = <span className={className}>{content}</span>;

  const newInnerHTML = ReactDOMServer.renderToStaticMarkup(newHTML);

  self.target.innerHTML = newInnerHTML;
}

export function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function isValidUrl(url, platfrom_url) {
  return isValidHttpUrl(url) && url.includes(platfrom_url);
}

export function getTiktokUsername(str) {
  let username = isValidUrl(str, 'tiktok.com')
    ? str.match(/@(.+?)(?:\?|$)/)[1]
    : str.includes('@')
    ? str.replace('@', '')
    : str;

  // Loại bỏ ký tự "/" cuối cùng (nếu có)
  if (username.endsWith('/')) {
    username = username.slice(0, -1);
  }
  return username;
}

export function exploringHtml() {
  return `
            <div class="spinner-border spinner-border-sm text-muted" style="opacity: 0.6" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
        `;
}

export function uploadInputFile(
  { formData, query },
  _then = () => {},
  _catch = () => {},
) {
  axios
    .post(baseUrl + `/input-file?${query}`, formData)
    .then((r) => _then(r.data))
    .catch((e) => _catch(e));
}

export function calculateTimeDifference(timeString1, timeString2) {
  const date1 = new Date(timeString1);
  const date2 = new Date(timeString2);

  const timeDifferenceMs = date1 - date2;
  const seconds = Math.floor(timeDifferenceMs / 1000);

  if (seconds >= 86400) {
    // 86400 seconds in a day
    return Math.floor(seconds / 86400) + 'd';
  } else if (seconds >= 3600) {
    // 3600 seconds in an hour
    return Math.floor(seconds / 3600) + 'h';
  } else if (seconds >= 60) {
    return Math.floor(seconds / 60) + 'm';
  } else {
    return seconds + 's';
  }
}

export function badgeStatus(status) {
  status = status.toLowerCase();
  switch (status) {
    case 'success':
      return 'status-green';
    case 'finished':
      return 'status-green';
    case 'processing':
      return 'status-yellow';
    case 'failed':
      return 'status-red';
    case 'stop':
      return 'status-dark';
    case 'exporting':
      return 'status-yellow-dark';
    case 'continue':
      return 'status-blue-dark';
    case 'recheck':
      return 'status-purple-dark';
    default:
      return 'status-default';
  }
}

export function formatDbDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getParamFromStr(str, p) {
  const urlParams = new URLSearchParams(str);
  return urlParams.get(p);
}

export function exportExcelFileFromArray(arr) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  arr.forEach((item) => {
    worksheet.addRow([item.column1]);
  });
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'template-category-suggestion.xlsx');
  });
}

export async function readExcelFileToArray() {
  try {
    return await processReadExcelFileToArray();
  } catch (error) {
    console.error('Đã xảy ra lỗi:', error);
  }
}

function processReadExcelFileToArray() {
  const inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = '.xlsx';
  inputElement.click();
  return new Promise((resolve, reject) => {
    inputElement.onchange = async () => {
      const file = inputElement.files[0];
      const rowsFilter = await processFileToArray(file);
      resolve(rowsFilter);
    };
  });
}

export async function processFileToArray(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  for (let cellAddress in worksheet) {
    if (!worksheet.hasOwnProperty(cellAddress)) continue;
    let cell = worksheet[cellAddress];
    console.log('cell', cell.v);
    console.log('cell', cell.w);
    if (cell.w && cell.v) {
      worksheet[cellAddress].v = cell.w;
    }
    if (cell.l && cell.l.Target) {
      worksheet[cellAddress].v = cell?.l?.Target; // Thay thế bằng giá trị của hyperlink
    }
  }

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    cellText: true,
  });
  return rows.filter((row) => row.some((i) => !!i));
}

export function arrayToTagFormat(arr) {
  return arr
    .flatMap((item) => item.filter(Boolean))
    .map((item, index) => {
      return {
        id: index + 1 + '',
        text: item,
      };
    });
}

export function countWordOccurrences(word, str) {
  const regex = new RegExp(word, 'g');
  const matches = str?.match(regex);

  return matches ? matches.length : 0;
}

export function getPlatform(link) {
  if (link.includes('youtube.com') || link.includes('youtu.be')) {
    return 'youtube';
  }
  if (link.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (link.includes('fb.com') || link.includes('facebook.com')) {
    return 'facebook';
  }
  if (link.includes('instagram.com')) {
    return 'instagram';
  }
}

export function formatTimeAgo(input) {
  let timestamp;
  if (isNaN(input)) {
    timestamp = +new Date(input);
  } else {
    if (('' + input).length < 11) {
      timestamp = input * 1000;
    } else timestamp = input;
  }
  const now = new Date();
  const pastDate = new Date(timestamp);

  const timeDifference = now - pastDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 30) {
    // Nếu thời gian đã trôi qua lớn hơn hoặc bằng 30 ngày, hiển thị theo định dạng yyyy/mm/dd
    const year = pastDate.getFullYear();
    const month = String(pastDate.getMonth() + 1).padStart(2, '0');
    const day = String(pastDate.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  } else if (days >= 1) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours >= 1) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes >= 1) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'now';
  }
}

export function getPostId(url, option = 'tiktok') {
  let video_id = '';

  switch (option) {
    case 'tiktok':
      const tiktokPath = new URL(url).pathname;
      const videoIndex = tiktokPath.indexOf('video/');

      if (videoIndex !== -1) {
        video_id = tiktokPath.substring(videoIndex + 6).trim();
      }
      break;

    case 'youtube':
      if (
        url.includes('youtube.com/watch') ||
        url.includes('youtube.com/shorts')
      ) {
        // Xóa các tham số và phần dư thừa trong URL
        if (url.includes('youtube.com')) {
          video_id = new URL(url).searchParams.get('v');
          if (!video_id) {
            const cleanUrl = url.split(/[?&]/)[0];
            if (cleanUrl.includes('shorts/')) {
              const params = cleanUrl.split('shorts/');
              video_id = params[1];
            }
          }
        }
        if (url.includes('youtu.be')) {
          const youtubePath = new URL(url).pathname;
          video_id = youtubePath.includes('/')
            ? youtubePath.replace(/\//g, '')
            : youtubePath;
        }
      }
      // Trả về null nếu không tìm thấy ID video
      if (url.includes('youtu.be')) {
        const youtubePath = new URL(url).pathname;
        video_id = youtubePath.includes('/')
          ? youtubePath.replace(/\//g, '')
          : youtubePath;
      }
      break;

    case 'facebook':
      // handle facebook case
      break;
    case 'instagram':
      var regexPattern =
        /^https:\/\/www\.instagram\.com\/p\/([A-Za-z0-9_-]+)\/.*$/;

      // Extract the post ID using regex
      var match = url?.match(regexPattern);

      if (match && match.length > 1) {
        return match[1];
      } else {
        return url; // Return null if no match found
      }
    default:
      video_id = -1;
      break;
  }

  return video_id;
}

export const getImageLoadingByPlatform = (platform) => {
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

export const toastWithAsyncFetch = async (
  messages,
  fetchFunc,
  successCallback,
  errorCallback,
) => {
  const toastId = toast.loading(messages.loading ?? 'Updating...');

  try {
    const res = await fetchFunc();

    if (res?.status === 200) {
      successCallback && successCallback(res);
      toast.update(toastId, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        render: messages.success ?? 'Successfull',
        type: toast.TYPE.SUCCESS,
        isLoading: false,
      });

      return true;
    }
  } catch (e) {
    errorCallback && errorCallback(e);
    console.log(e);
    toast.update(toastId, {
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      render: messages.error ?? 'Failed',
      type: toast.TYPE.ERROR,
      isLoading: false,
    });

    return false;
  }
};

const handleMergeByTime = (chunk, granularity) => {
  const startDate = new Date(chunk[0].date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDate = new Date(chunk[chunk.length - 1].date).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    },
  );
  const time = `${startDate} - ${endDate}`;

  const sum = chunk.reduce((acc, obj) => {
    const total = acc.total + obj.total;
    const success = acc.success + obj.success;
    const error = acc.error + obj.error;

    return { total, success, error };
  });

  return { date: time, ...sum };
};

export const handleDataWithGranularity = (data, granularity) => {
  const result = [];

  switch (granularity) {
    case 'day':
      result = data;
      break;
    case 'week':
      for (let i = 0; i < data.length; i += 7) {
        const chunk = data.slice(i, i + 7);
        console.log('chunk', chunk);
        const sum = handleMergeByTime(chunk, granularity);
        console.log('sum', sum);
        result.push(sum);
      }
      break;
    case 'month':
      for (let i = 0; i < data.length; i += 30) {
        const chunk = data.slice(i, i + 30);
        const sum = handleMergeByTime(chunk, granularity);
        result.push(sum);
      }
      break;
    case 'quarter':
      for (let i = 0; i < data.length; i += 90) {
        const chunk = data.slice(i, i + 90);
        const sum = handleMergeByTime(chunk, granularity);
        result.push(sum);
      }
      break;
    case 'year':
      for (let i = 0; i < data.length; i += 365) {
        const chunk = data.slice(i, i + 365);
        const sum = handleMergeByTime(chunk, granularity);
        result.push(sum);
      }
      break;
    default:
      break;
  }

  return result;
};
