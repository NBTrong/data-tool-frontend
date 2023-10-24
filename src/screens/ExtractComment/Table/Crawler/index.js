import React from 'react';
import Handle from './Handle';
import useQueryString from "../../../../hooks/useQueryString";

const Index = ({ linkList = [] }) => {
  const {queryString} = useQueryString();
  const {language_code} = queryString;

  return (
    <>
      {linkList.map((item, index) => {
        return <Handle item={item} language_code={language_code} timeout={(index+0.1) * 2000} index={index}/>;
      })}
    </>
  );
};

export default Index;
