import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import { timestampToDate } from '../../../utils/helpers';

const SHEET_NAME = 'Sheet 1';
const COLUMN_TITLES = [
  'Name',
  'Platforms',
  'Total Contents',
  'Views',
  'Save',
  'Likes',
  'Shares',
  'Comments',
  'Imported At',
];
const TITLE_FONT = { size: 14, bold: true };
const ROW_FONT = { size: 12 };
const HORIZONTAL_ALIGNMENT = { horizontal: 'left' };

export const exportExcelData = async (data) => {
  try {
    if (!data.length) {
      toast.error('File content is empty.\n', 'error');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(SHEET_NAME);

    const titleRow = worksheet.addRow(COLUMN_TITLES);
    titleRow.font = TITLE_FONT;

    data.forEach((item) => {
      const row = worksheet.addRow([
        item.name,
        item.platforms,
        item.total_contents,
        item.total_views,
        item.total_saves,
        item.total_likes,
        item.total_shares,
        item.total_comments,
        timestampToDate(item.created_at),
      ]);
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
