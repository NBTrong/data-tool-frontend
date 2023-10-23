import React from 'react';
import Handle from './Handle';
import useQueryString from "../../../../hooks/useQueryString";

const maxChunk = 2;

const Index = ({ linkList = [] }) => {
  const {queryString} = useQueryString();
  const {language_code} = queryString;

  return (
    <>
      {linkList.map((item, index) => {
        return <Handle item={item} language_code={language_code} timeout={(parseInt(index/maxChunk)) * 3000}/>;
      })}
    </>
  );
};

export default Index;
