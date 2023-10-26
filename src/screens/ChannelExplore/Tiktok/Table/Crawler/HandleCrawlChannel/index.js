import React, { useEffect, useState, useContext,useMemo } from 'react';
import Crawl from './Crawl';
import { ListSuccessChannelContext } from '../index';
import {getTiktokUsername} from "../../../../../../utils/helpers";
import useTiktokUserInfo from "../../../../../../hooks/useTiktokUserInfo";
import {TableContext} from "../../index";

const HandleCrawlChannel = ({ keyword, limitCount = 10 }) => {
  const limitRefresh = 5;
  const [cursors, setCursors] = useState([null]); //lists pages (cusors)
  const [isSuccess, setIsSuccess] = useState(0);
  const [refresh, setRefresh] = useState(0); //refresh if fetch user info is failed or null result data
  const {handleUpdateOverlookLists} = useContext(TableContext);

  const { listSuccessChannel, setListSuccessChannel } = useContext(
    ListSuccessChannelContext,
  );

  const userName = useMemo(() => {
    return getTiktokUsername(keyword);
  }, [keyword]);

  const { uid, user, isSuccess: userInfoIsSuccess,isLoading: userInfoIsLoading,notfound } = useTiktokUserInfo({
    username: userName,
    refresh,
  });

  // handle to call api get user info again if data is null
  useEffect(() => {
    if (userInfoIsSuccess && !uid) {
      //just refresh with numb is limitRefresh value
      if (refresh < limitRefresh){
        setRefresh(refresh + 1);
      } else {
        //if refresh more time limitRefresh value then stop and set this channel crawl success
        setIsSuccess(1)
      }
    }
  }, [userInfoIsSuccess, refresh]);

  //update status of this channel
  const itemUpdate = useMemo(()=>{
    return {
      name: keyword,
      user: user,
      status: userInfoIsLoading ? "searching" : ((userInfoIsSuccess && !notfound) ? "crawling" : (refresh > 5 ? "notfound" : 'crawling')),
    }
  },[user,userInfoIsSuccess,userInfoIsLoading,notfound])

  //push status of this channel
  useEffect(()=>{
    if(userInfoIsLoading || userInfoIsSuccess){
      handleUpdateOverlookLists(itemUpdate)
    }
  },[itemUpdate])

  //add new page
  const handleAddCursor = (newCursor) => {
    const newCursors = [...cursors, newCursor];
    setCursors(newCursors);
  };

  //handle success status of this channel
  useEffect(() => {
    if (isSuccess) {
      if (!listSuccessChannel.includes(keyword)) {
        setListSuccessChannel(() => listSuccessChannel.concat(keyword));
      }
    }
  }, [isSuccess, listSuccessChannel]);

  return (
    <>
      {cursors &&
        cursors.map((cursor, i) => {
          return (
            <Crawl
              index={i}
              key={`crawl-${i}`}
              keyword={keyword}
              uid={uid}
              maxCursor={cursor}
              addNewCursor={handleAddCursor}
              setIsSuccess={setIsSuccess}
              itemUpdate={itemUpdate}
            />
          );
        })}
    </>
  );
};

export default HandleCrawlChannel;
