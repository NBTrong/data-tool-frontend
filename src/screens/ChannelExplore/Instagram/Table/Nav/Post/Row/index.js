import React from 'react';

import HandleRowImage from './HandleImage';
const Row = ({ posts }) => {
  let timeOut = 0;
  return (
    <>
      {posts?.map((post) => {
        timeOut = timeOut + 1000;
        return <HandleRowImage post={post} timeOut={timeOut} />;
      })}
    </>
  );
};

export default Row;
