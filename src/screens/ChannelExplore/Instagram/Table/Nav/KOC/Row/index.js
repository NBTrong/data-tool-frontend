import React from 'react';

import HandleRowImage from './HandleImage';
const Row = ({ KOCs }) => {
  return (
    <>
      {KOCs?.map((KOC) => {
        return <HandleRowImage KOC={KOC} />;
      })}
    </>
  );
};

export default Row;
