import React, { useState, useEffect, useCallback } from 'react';
import Handle from './Handle';
import { toast } from 'react-toastify';
const Index = ({
  keywords = [],
  numberPosts = 300,
  startOffset = 0,
  setIsLoading,
}) => {
  const countTurn = 3;
  const offsetTurn = 11;
  const [handles, setHandles] = useState([]);
  const [offset, setOffset] = useState(0);
  const [keywordsExplored, setKeywordsExplored] = useState([]);
  const [countHandleAction, setCountHandleAction] = useState(0);
  const [isShowToast, setIsShowToast] = useState(true);

  useEffect(() => {
    setCountHandleAction(0);
    setIsShowToast(true);
    if (!keywords.length) {
      setIsLoading(false);
    }
  }, [keywords]);

  const pushHandleAction = useCallback(() => {
    const keywordsArr = keywordsExplored.length
      ? keywords.filter(({ text }) => !keywordsExplored.includes(text))
      : keywords;
    if (!keywordsArr.length) {
      if (isShowToast) {
        toast.success('Finished exploring all keywords');
        setIsShowToast(false);
      }
      setIsLoading(false);
      return;
    }
    const keyword = keywordsArr[0].text;
    const newHandles = [];
    let offsetNow = offset;
    for (let i = 0; i < countTurn; i++) {
      setIsLoading(true);
      newHandles.push(<Handle keyword={keyword} offset={offsetNow + ''} />);
      offsetNow += offsetTurn;
    }
    setHandles((prevHandles) => [...prevHandles, ...newHandles]);
    if (offsetNow >= numberPosts) {
      setOffset(0);
      setKeywordsExplored(keywordsExplored.concat(keyword));
    } else setOffset(offsetNow);
  }, [keywords, keywordsExplored, offset, isShowToast]);

  useEffect(() => {
    if (!countHandleAction && keywords.length) {
      setCountHandleAction(1);
      pushHandleAction();
    }
  }, [keywords, pushHandleAction, countHandleAction]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (keywords.length > 0) {
        pushHandleAction();
      }
    }, 4000);
    return () => clearInterval(intervalId);
  }, [pushHandleAction]);

  return <>{handles}</>;
};
export default Index;
