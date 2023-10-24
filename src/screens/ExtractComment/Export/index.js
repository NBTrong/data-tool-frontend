import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import {timestampToDate} from '../../../utils/helpers';

const SHEET_NAME = 'Sheet 1';
const COLUMN_TITLES = [
  'Post',
  'Platform',
  'Total Comments',
  'Commenter',
  'Text',
  'Comment at',
];

const TITLE_FONT = { size: 14, bold: true };

const getRowData = (item) => {
  return [
    item.url,
    item.platform,
    item.statistics?.comment_count,
    item.statistics?.save_count,
    item.create_time ? timestampToDate(item.create_time) : '',
  ]
}
const getRowChildData = (item) => {
  return [
    "",
    "",
    "",
    "@"+item.user.unique_id,
    item.text,
    item.create_time ? timestampToDate(item.create_time) : '',
  ]
}
export const exportExcelData = async (data) => {
  try {
    // console.log('data', data);
    if (!data.length) {
      toast.error('File content is empty.\n', 'error');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(SHEET_NAME);
    worksheet.state = {};

    const titleRow = worksheet.addRow(COLUMN_TITLES);
    titleRow.font = TITLE_FONT;

    let row_start = 2;

    data.forEach((val,index) => {
      // const rowData = getRowData(item);
      const item = {...val};
      item?.comments?.forEach((comment)=>{
        if (comment?.replies?.length){
          item?.comments?.push(...comment?.replies)
        }
      })
      item?.comments?.forEach((comment)=>{
        const rowChildData = getRowChildData(comment);
        worksheet.addRow(rowChildData);
      })
      // const row = worksheet.addRow(rowData);
      if (item?.comments?.length > 1){
        worksheet.mergeCells(`A${row_start}`,`A${row_start+item?.comments?.length -1}`);
        worksheet.mergeCells(`B${row_start}`,`B${row_start+item?.comments?.length -1}`);
        worksheet.mergeCells(`C${row_start}`,`C${row_start+item?.comments?.length -1}`);

        const row = getRowData(item)
        worksheet.getCell(`A${row_start}`).value = row[0];
        worksheet.getCell(`B${row_start}`).value = row[1];
        worksheet.getCell(`C${row_start}`).value = row[1];

        row_start = row_start+item?.comments?.length;
      } else {
        const row = getRowData(item)
        worksheet.getCell(`A${row_start}`).value = row[0];
        worksheet.getCell(`B${row_start}`).value = row[1];
        worksheet.getCell(`C${row_start}`).value = row[1];
        row_start = row_start+1;
      }
      // worksheet.mergeCells(`B${index+2}:B${index+2+item?.comments?.length}`);
      // row.font = ROW_FONT;
      // row.alignment = HORIZONTAL_ALIGNMENT;
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
