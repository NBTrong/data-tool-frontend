import React, {useState, useEffect, useCallback, useContext} from 'react';
import Handle from './Handle';
import { toast } from 'react-toastify';
import useQueryString from "../../../../../hooks/useQueryString";
import {DataCrawledContext} from "../../index";

const offsetHashtagTurn = 20;
const offsetKeywordTurn = 20;

const Index = ({ keywords = [], numberPosts = 300, setIsLoading }) => {
  const countTurn = 1;

  const [handles, setHandles] = useState([]);
  const [offset, setOffset] = useState(0);
  const [keywordsExplored, setKeywordsExplored] = useState([]);
  const [keywordExploredAllPosts, setKeywordExploredAllPosts] = useState('');
  const [countHandleAction, setCountHandleAction] = useState(0);
  const [isShowToast, setIsShowToast] = useState(true);
  const {queryString} = useQueryString();
  const {publish_time} = queryString;

  const {setDataCrawled} = useContext(DataCrawledContext)

  useEffect(()=>{
    setOffset(0)
    setDataCrawled([])
  },[publish_time])

  const isHashtag = useCallback((str) => {
    return str.includes('#');
  }, []);

  useEffect(() => {
    setCountHandleAction(0);
    setIsShowToast(true);
    if (!keywords.length) {
      setIsLoading(false);
    }
    setOffset(0);
  }, [keywords]);

  // useEffect(() => {
  //   setKeywordsExplored([]);
  //   setCountHandleAction(0);
  //   if (numberPosts === limitPoint) {
  //     setOffset(0);
  //   } else {
  //     setOffset(200);
  //   }
  // }, [numberPosts]);

  useEffect(()=>{
    setOffset(0);
  },[keywordExploredAllPosts])

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
    const numberPostsNow = isHashtag(keyword) ? numberPosts : 350;
    const newHandles = [];
    let offsetNow = offset;
    for (let i = 0; i < countTurn; i++) {
      setIsLoading(true);
      newHandles.push(
        <Handle
          keyword={keyword}
          offset={offsetNow + ''}
          offsetEnd={numberPostsNow}
          setKeywordExploredAllPosts={setKeywordExploredAllPosts}
        />,
      );
      offsetNow += isHashtag(keyword) ? offsetHashtagTurn : offsetKeywordTurn;
    }
    setHandles((prevHandles) => [...prevHandles, ...newHandles]);
    if (offsetNow >= numberPostsNow) {
      setOffset(0);
      setKeywordsExplored(keywordsExplored.concat(keyword));
    } else setOffset(offsetNow);
  }, [keywords, keywordsExplored, offset, isShowToast]);

  useEffect(() => {
    if (!countHandleAction && keywords.length) {
      pushHandleAction();
      setCountHandleAction(1);
    }
  }, [keywords, pushHandleAction, countHandleAction, numberPosts]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (keywords.length > 0) {
        pushHandleAction();
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [pushHandleAction]);

  useEffect(() => {
    if (keywordExploredAllPosts) {
      if (!keywordsExplored.includes(keywordExploredAllPosts)) {
        setKeywordsExplored(() =>
          keywordsExplored.concat(keywordExploredAllPosts),
        );
        toast.success(
          `Finished explore all posts of keyword: "${keywordExploredAllPosts}"`,
        );
        setOffset(numberPosts > 1000 ? 200 : 0);
        setKeywordExploredAllPosts('');
      }
    }
  }, [keywordsExplored, keywordExploredAllPosts]);

  return <>{handles}</>;
};
export default Index;
