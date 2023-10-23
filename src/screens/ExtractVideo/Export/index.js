import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import { countWordOccurrences, timestampToDate } from '../../../utils/helpers';

const SHEET_NAME = 'Sheet 1';
const COLUMN_TITLES = [
  'Post',
  'Title',
  'Platform',
  'Views',
  'Likes',
  'Shares',
  'Comments',
  'Save',
  'Uploaded',
];
const TITLE_FONT = { size: 14, bold: true };
const ROW_FONT = { size: 12 };
const HORIZONTAL_ALIGNMENT = { horizontal: 'left' };

const getRowData = (item, activeDetectVoice, keywordsDetectVoice) => {
  if (activeDetectVoice) {
    return [
      item.url,
      item.title,
      activeDetectVoice && item.transcript,
      activeDetectVoice && keywordsDetectVoice.map(({ text: key }) => {
        return `${key} (${countWordOccurrences(key, item.transcript)})`
      }).join(','),
      item.platform,
      item.statistics?.view_count,
      item.statistics?.like_count,
      item.statistics?.share_count,
      item.statistics?.comment_count,
      item.statistics?.save_count,
      item.created_at ? timestampToDate(item.created_at) : '',
    ]
  } else {
    return [
      item.url,
      item.title,
      item.platform,
      item.statistics?.view_count,
      item.statistics?.like_count,
      item.statistics?.share_count,
      item.statistics?.comment_count,
      item.statistics?.save_count,
      item.created_at ? timestampToDate(item.created_at) : '',
    ]
  }
}

export const exportExcelData = async (data, activeDetectVoice, keywordsDetectVoice) => {
  try {
    // console.log('data', data);
    if (!data.length) {
      toast.error('File content is empty.\n', 'error');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(SHEET_NAME);

    const titleRow = worksheet.addRow(COLUMN_TITLES);
    titleRow.font = TITLE_FONT;

    data.forEach((item) => {
      const rowData = getRowData(item, activeDetectVoice, keywordsDetectVoice);
      const row = worksheet.addRow(rowData);
      row.font = ROW_FONT;
      row.alignment = HORIZONTAL_ALIGNMENT;
    });

    const utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `dataExtract-${utc}.xlsx`);
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while exporting data.\n', 'error');
  }
};
