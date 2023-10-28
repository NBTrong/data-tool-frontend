import axios from 'axios';
import cn from 'classnames';
import React, { useContext, useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { HiDotsHorizontal } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { GlobalShareContext } from '../../../../App';
import { ConfirmContent, Modal } from '../../../../components';
import Popover from '../../../../components/Popover';
import useQueryString from '../../../../hooks/useQueryString';
import baseUrl from '../../../../services/config/baseUrl';
import { handleLongNumber, timestampToDate } from '../../../../utils/helpers';

import styles from './Row.module.sass';

const Row = ({ item }) => {
  const navigate = useNavigate();
  const { parseQueryString } = useQueryString();
  const { setGlobalShare } = useContext(GlobalShareContext);
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e) => {
    setGlobalShare({
      title: item.name,
    });
    navigate({
      pathname: '/extract-data/videos',
      search: `?${parseQueryString(`?campaignId=${item.id}`)}`,
    });
  };

  const handleDeleteCampaign = (id) => {
    setIsLoading(true);
    axios.delete(`${baseUrl}/campaigns/${id}`).then((r) => {
      toast.success('Delete campaign successfully');
      setIsConfirmMode(false);
      setIsDelete(true);
      setIsLoading(false);
    });
  };

  return (
    <>
      <div
        className={cn(styles.row, `cursor-pointer ${isDelete ? 'd-none' : ''}`)}
      >
        <div
          onClick={handleNavigate}
          className={cn(styles.col, 'p-3 border-0')}
        >
          <div className={cn(styles.text_gray, 'link-primary')}>
            {item.name}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.text_gray}>{item.platforms}</div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.badge_gray}>
            {handleLongNumber(item.total_contents) ?? '0'}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.badge_gray}>
            {handleLongNumber(item.total_views) ?? '0'}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.badge_gray}>
            {handleLongNumber(item.total_saves) ?? '0'}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.badge_gray}>
            {handleLongNumber(item.total_likes) ?? '0'}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.badge_gray}>
            {handleLongNumber(item.total_shares) ?? '0'}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.badge_gray}>
            {handleLongNumber(item.total_comments) ?? '0'}
          </div>
        </div>
        <div className={cn(styles.col, 'p-3 border-0')}>
          <div className={styles.text_gray}>
            {timestampToDate(item.created_at)}
          </div>
        </div>
        <div className={styles.col}>
          <Popover
            contents={[
              {
                component: (
                  <div
                    className={cn({ [styles.threeDots]: false })}
                    onClick={() => setIsConfirmMode(true)}
                  >
                    <>
                      <BsFillTrashFill size={18} />
                      <span className={cn('ms-3')}>Delete</span>
                    </>
                  </div>
                ),
                onClick: () => {
                  setIsConfirmMode(true);
                },
              },
            ]}
          >
            <HiDotsHorizontal className={styles.btn} />
          </Popover>
        </div>
      </div>

      <Modal visible={isConfirmMode} onClose={() => setIsConfirmMode(false)}>
        <ConfirmContent
          title="Confirm"
          content="Are you sure you want to delete this campaign?"
          contentBtnSubmit="Delete"
          contentBtnCancel="Cancel"
          isLoading={isLoading}
          onClose={() => setIsConfirmMode(false)}
          handleSubmit={() => handleDeleteCampaign(item.id)}
        />
      </Modal>
    </>
  );
};

export default Row;
