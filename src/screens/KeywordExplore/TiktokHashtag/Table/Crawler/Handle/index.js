import React from 'react';
import HandleHashtag from './Hashtag';
import HandleKeyword from './Keyword';

const Handle = ({
  keyword,
  offset,
  offsetEnd = 200,
  setKeywordExploredAllPosts,
}) => {
  return (
    <>
      {keyword.includes('#') ? (
        <HandleHashtag
          keyword={keyword}
          offsetEnd={offsetEnd}
          offset={offset}
          setKeywordExploredAllPosts={setKeywordExploredAllPosts}
        ></HandleHashtag>
      ) : (
        <HandleKeyword
          keyword={keyword}
          offsetEnd={offsetEnd}
          offset={offset}
          setKeywordExploredAllPosts={setKeywordExploredAllPosts}
        />
      )}
    </>
  );
};

export default Handle;
