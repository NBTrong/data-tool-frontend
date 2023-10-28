import cn from 'classnames';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai/index';
import { BiDownload } from 'react-icons/bi/index';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

import { GlobalShareContext } from '../../App';
import { Card, Modal } from '../../components';
import ConfirmContentWithInput from '../../components/ConfirmContentWithInput';
import { addCampaignSchema } from '../../utils/ValidateSchema';
import { EXTRACT_DATA_EXCEL_TEMPLATE } from '../../utils/helpers';
import { exportExcelData } from './Export';
import Table from './Table';

import styles from './Content.module.sass';

export const DataCrawledContext = createContext([]);

export default function Campaign() {
  const navigate = useNavigate();
  const [countCampaign, setCountCampaigns] = useState([]);
  const [fileExport, setFileExport] = useState([]);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const { setGlobalShare } = useContext(GlobalShareContext);

  const readExcelFile = useCallback((campaign) => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.xlsx';
    inputElement.onchange = (event) => {
      const file = inputElement.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setGlobalShare({
          fileData: rows,
          campaign,
        });
        navigate('/extract-data/videos');
      };
      fileReader.readAsBinaryString(file);
    };
    inputElement.click();
  }, []);

  const handleExportData = (e) => {
    e.preventDefault();
    exportExcelData(fileExport);
  };

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
      saveAs(blob, 'template.xlsx');
    });
  }, []);

  const handleUploadFileEvent = (e) => {
    e.preventDefault();
    setIsConfirmMode(true);
  };

  const handleSkipMode = () => {
    setIsConfirmMode(false);
  };

  const handleSaveMode = ({ name }) => {
    setIsConfirmMode(false);
    toast.info('The entire data extract of this file will be saved');
    readExcelFile(name);
  };

  return (
    <>
      <Modal visible={isConfirmMode} onClose={() => setIsConfirmMode(false)}>
        <ConfirmContentWithInput
          title="Add Campaign"
          inputLabel="Campaign Name"
          inputPlaceholder="Ex: March 8th 2023"
          inputName="name"
          contentBtnSubmit="Save"
          contentBtnCancel="Cancel"
          validate={addCampaignSchema}
          onClose={() => handleSkipMode()}
          handleSubmit={(event) => handleSaveMode(event)}
        />
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
          Add Campaign (Excel)
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
        title={(countCampaign ?? '0') + ' Campaigns'}
        classTitle={cn('title-purple text-nowrap', styles.title)}
        classCardHead={cn(
          styles.head,
          { [styles.hidden]: false },
          'flex-nowrap align-items-center mb-4',
        )}
        head={
          <>
            <div
              className={
                'w-100 d-flex justify-content-between align-items-center'
              }
            >
              <div></div>
              <div>
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
          className={cn(
            styles.row,
            { [styles.flex]: false },
            styles.overflow_scroll_but_hide_scrollbar,
          )}
        >
          <Table
            setCountCampaigns={setCountCampaigns}
            className={styles.table}
            setFileExport={setFileExport}
          ></Table>
        </div>
      </Card>
    </>
  );
}
