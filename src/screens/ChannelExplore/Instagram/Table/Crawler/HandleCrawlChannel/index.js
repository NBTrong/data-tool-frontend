import React, { useEffect, useState, useCallback, useContext } from 'react';
import Crawl from './Crawl';
import { CountSuccessChannelContext } from '../index';

const HandleCrawlChannel = ({ keyword, limitPage = 1 }) => {
  // console.log(`limit page now: ${limitPage}`)
  const countTurn = limitPage; // tính toán số lần lặp lại cần thiết
  const [listPages, setListPages] = useState([null]);
  const [noMoreCursor, setNoMoreCursor] = useState(0);
  const { countSuccessChannel, setCountSuccessChannel } = useContext(
    CountSuccessChannelContext,
  );
  const [countSuccess, setCountSuccess] = useState(0);
  const handleAddPage = (newCursor) => {
    const newCursors = [...listPages, newCursor];
    setListPages(newCursors);
  };

  const handleSetCountSuccess = useCallback(() => {
    setCountSuccess(countSuccess + 1);
  }, [countSuccess]);

  useEffect(() => {
    if (countSuccess === limitPage || noMoreCursor) {
      setCountSuccessChannel(countSuccessChannel + 1);
    }
  }, [countSuccess, noMoreCursor]);

  const crawls = [];
  for (let i = 0; i < countTurn; i++) {
    if (listPages[i] !== undefined) {
      crawls.push(
        <Crawl
          keyword={keyword}
          cursor={listPages[i]}
          addNewPage={handleAddPage}
          setNoMoreCursor={setNoMoreCursor}
          handleSetCountSuccess={handleSetCountSuccess}
        />,
      );
    }
  }
  return <>{crawls}</>;
};

export default HandleCrawlChannel;
