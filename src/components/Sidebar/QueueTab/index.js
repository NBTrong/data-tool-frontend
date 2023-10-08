import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import styles from '../Sidebar.module.sass';
import cn from 'classnames';

import Icon from '../../Icon';
import axios from 'axios';
import baseUrl from '../../../services/config/baseUrl';
import { GlobalShareContext } from '../../../App';

const QueueTab = ({ key, onClose }) => {
  const [count, setCount] = useState(0);
  const [animation, setAnimation] = useState('');
  const { globalShare, setGlobalShare } = useContext(GlobalShareContext);

  useEffect(() => {
    console.log(globalShare);
    if (globalShare?.countInputFile?.includes('plush')) {
      handleIncrement();
      setGlobalShare((prev) => {
        const newShare = { ...prev }; // Tạo một bản sao của đối tượng prev để không làm thay đổi trực tiếp đối tượng gốc
        newShare.countInputFile = ''; // Thêm thuộc tính countInputFile và đặt giá trị là "plush"
        return newShare; // Trả về đối tượng mới đã được cập nhật
      });
    }
  }, [globalShare]);

  const handleIncrement = () => {
    setAnimation('plus_one');
    setCount((prevCount) => prevCount + 1);
    setTimeout(() => {
      setAnimation('');
    }, 1000);
  };

  const handleDecrement = () => {
    setAnimation('minus_one');
    setCount((prevCount) => prevCount - 1);
    setTimeout(() => {
      setAnimation('');
    }, 1000);
  };

  useEffect(() => {
    axios
      .get(baseUrl + '/input-file/count')
      .then((r) => setCount(parseInt(r?.data?.data[0].count)));
  }, []);

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          styles.item,
          { [styles.active]: isActive },
          'd-flex justify-content-between position-relative',
        )
      }
      to={'/queue'}
      key={key}
      end
      onClick={onClose}
    >
      <div>
        <Icon name={'queue'} size="24" />
        Queue
      </div>
      {!!count && (
        <span className={'badge bg-secondary rounded-circle'}>{count}</span>
      )}
      <div className={'position-absolute'} style={{ right: '-10px' }}>
        <span id="number" className={`hidden ${styles[animation]}`}>
          {animation === 'plus_one' ? '+1' : ''}
        </span>
      </div>
    </NavLink>
  );
};

export default QueueTab;
