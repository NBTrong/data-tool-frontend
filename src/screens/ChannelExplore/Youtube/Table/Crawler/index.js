import React, { useState, useEffect, useCallback, createContext } from 'react';
import HandleCrawlChannel from './HandleCrawlChannel';
import { toast } from 'react-toastify';

export const CountSuccessChannelContext = createContext([]);

const Index = ({ keywords = [], setIsLoading, limitPage = 1 }) => {
  const [handles, setHandles] = useState([]);
  const [countSuccessChannel, setCountSuccessChannel] = useState(0);
  const [countHandleAction, setCountHandleAction] = useState(0);
  const [keywordsExplored, setKeywordsExplored] = useState([]);
  const [catchLoadingStatus, setCatchLoadingStatus] = useState(1);

  const handleSetCountSuccessChannel = useCallback(() => {
    // console.log('countSuccessChannel now', countSuccessChannel);
    setCountSuccessChannel(countSuccessChannel + 1);
  }, [countSuccessChannel, setCountSuccessChannel]);

  useEffect(() => {
    setKeywordsExplored(
      keywordsExplored.filter((k) => keywords.some((i) => i.text === k)),
    );
  }, [keywords]);

  useEffect(() => {
    setCountHandleAction(0);
    setCatchLoadingStatus(1);
  }, [keywords, limitPage]);

  useEffect(() => {
    setKeywordsExplored([]);
    setCountSuccessChannel(0);
  }, [limitPage]);

  useEffect(() => {
    if (catchLoadingStatus) {
      if (keywords.length && countSuccessChannel >= keywords.length) {
        setCatchLoadingStatus(0);
        setCountSuccessChannel(keywords.length);
        setIsLoading(false);
        toast.success('Explore all channels successfully');
      } else {
        setIsLoading(true);
      }
    }
  }, [countSuccessChannel, keywords, catchLoadingStatus, keywordsExplored]);

  const pushHandleAction = useCallback(() => {
    const keywordsArr = keywordsExplored.length
      ? keywords.filter(({ text }) => !keywordsExplored.includes(text))
      : keywords;
    if (keywordsArr.length > 0) {
      const newHandles = [];
      const keywordExploring = [];
      for (let i = 0; i < 2; i++) {
        if (keywordsArr[i]) {
          const keyword = keywordsArr[i].text;
          newHandles.push(
            <HandleCrawlChannel limitPage={limitPage} keyword={keyword} />,
          );
          keywordExploring.push(keyword);
        }
      }
      setKeywordsExplored([...keywordsExplored, ...keywordExploring]);
      setHandles((prevHandles) => [...prevHandles, ...newHandles]);
    }
  }, [
    keywords,
    handles,
    keywordsExplored,
    limitPage,
    countSuccessChannel,
    handleSetCountSuccessChannel,
  ]);

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
    }, 17000);
    return () => clearInterval(intervalId);
  }, [pushHandleAction]);

  return (
    <CountSuccessChannelContext.Provider
      value={{ countSuccessChannel, setCountSuccessChannel }}
    >
      <>{handles}</>
    </CountSuccessChannelContext.Provider>
  );
};

export default Index;
