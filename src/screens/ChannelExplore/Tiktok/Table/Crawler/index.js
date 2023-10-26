import React, { useState, useEffect, useCallback, createContext } from 'react';
import HandleCrawlChannel from './HandleCrawlChannel';
import { toast } from 'react-toastify';
import { checkArraysEquality } from '../../../../../utils/helpers';

export const ListSuccessChannelContext = createContext([]);

const turn = 5;

const Index = ({ keywords = [], setIsLoading, limitCount = 10 }) => {
  const [handles, setHandles] = useState([]);
  const [listSuccessChannel, setListSuccessChannel] = useState([]);
  const [listChannelExploring, setListChannelExploring] = useState([]);
  const [countHandleAction, setCountHandleAction] = useState(0);
  const [keywordsExplored, setKeywordsExplored] = useState([]);
  const [catchLoadingStatus, setCatchLoadingStatus] = useState(1);
  useEffect(() => {
    setKeywordsExplored(
      keywordsExplored.filter((k) => keywords.some((i) => i.text === k)),
    );
    setListSuccessChannel(
      listSuccessChannel.filter((k) => keywords.some((i) => i.text === k)),
    );
  }, [keywords]);

  useEffect(() => {
    setCatchLoadingStatus(1);
  }, [keywords, limitCount]);

  useEffect(() => {
    if (listChannelExploring <= turn){
      setCountHandleAction(0);
    }
  }, [keywords, listChannelExploring]);

  useEffect(() => {
    if (catchLoadingStatus) {
      if (
        keywords.length &&
        checkArraysEquality(keywordsExplored, listSuccessChannel) &&
        listSuccessChannel.length >= keywords.length
      ) {
        setCatchLoadingStatus(0);
        setIsLoading(false);
        toast.success('Explore all channels successfully');
      } else {
        if (keywords.length) {
          setIsLoading(true);
        } else setIsLoading(false);
      }
    }
  }, [listSuccessChannel, keywords, catchLoadingStatus, keywordsExplored]);

  useEffect(() => {
    setKeywordsExplored([]);
    setListSuccessChannel([]);
  }, [limitCount]);

  const pushHandleAction = useCallback(() => {
    const keywordsArr = keywordsExplored.length
      ? keywords.filter(({ text }) => !keywordsExplored.includes(text))
      : keywords;
    if (keywordsArr.length > 0) {
      const newHandles = [];
      const keywordExploring = [];
      for (let i = 0; i < 1; i++) {
        const index = Math.floor(Math.random() * keywordsArr.length);
        const keyword = keywordsArr[index].text;
        newHandles.push(
          <HandleCrawlChannel limitCount={limitCount} keyword={keyword} />,
        );
        if (!keywordExploring.includes(keyword)) {
          keywordExploring.push(keyword);
        }
      }
      setKeywordsExplored([...keywordsExplored, ...keywordExploring]);
      setHandles((prevHandles) => [...prevHandles, ...newHandles]);
    }
  }, [keywords, handles, keywordsExplored, limitCount, listSuccessChannel]);

  useEffect(()=>{
    if (listChannelExploring.length < turn){
      pushHandleAction()
    }
  },[listSuccessChannel,keywords,listChannelExploring])

  // useEffect(() => {
  //   if (!countHandleAction && keywords.length) {
  //     setCountHandleAction(1);
  //     pushHandleAction();
  //   }
  // }, [keywords, pushHandleAction, countHandleAction]);

  useEffect(()=>{
    let difference = keywordsExplored.filter(x => !listSuccessChannel.includes(x));
    setListChannelExploring(difference)
  },[keywordsExplored,listSuccessChannel])

  return (
    <ListSuccessChannelContext.Provider
      value={{ listSuccessChannel, setListSuccessChannel }}
    >
      <>{handles}</>
    </ListSuccessChannelContext.Provider>
  );
};

export default Index;
