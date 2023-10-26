import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import {
  convertToDateFormat,
  getUrlFromString,
} from '../../../../utils/helpers';

const SHEET_NAME = 'Sheet 1';
const getTitleColumn = (type) => {
  if (type === 'post') {
    return [
      'Video URL',
      'Description',
      'KOC',
      'Views',
      'Likes',
      'Comments',
      'Uploaded',
    ];
  }
  if (type === 'KOC') {
    return [
      'KOC',
      'Related Contents',
      'Videos',
      'Followers',
      'Views',
      'Likes',
      'Latest Content',
    ];
  }
};
const getRowAdd = (item, type) => {
  if (type === 'post') {
    return [
      item?.video.url,
      item?.name,
      '@' + item?.author?.unique_id,
      item?.total_views,
      item?.total_likes,
      item?.total_views > 5000000 && item?.total_comments === 0
        ? '1000 +'
        : item?.total_comments,
      convertToDateFormat(item?.created_at),
    ];
  }
  if (type === 'KOC') {
    return [
      '@' + item?.author?.unique_id,
      (item?.videos).map((i) => getUrlFromString(i.url)).join('\n'),
      item?.videos.length,
      item?.author?.follower_count,
      item?.total_views,
      item?.total_likes,
      convertToDateFormat(item?.latest_content),
    ];
  }
};
const TITLE_FONT = { size: 14, bold: true };
const ROW_FONT = { size: 12 };
const HORIZONTAL_ALIGNMENT = { horizontal: 'left' };

export const exportExcelData = async (data, type) => {
  try {
    if (!data.length) {
      toast.error('File content is empty.\n', 'error');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(SHEET_NAME);

    const titleColumn = getTitleColumn(type);
    const titleRow = worksheet.addRow(titleColumn);
    titleRow.font = TITLE_FONT;

    data.forEach((item) => {
      const row = worksheet.addRow(getRowAdd(item, type));
      row.font = ROW_FONT;
      row.alignment = HORIZONTAL_ALIGNMENT;
    });

    const utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `keyword-explore-${utc}.xlsx`);
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while exporting data.\n', 'error');
  }
};
