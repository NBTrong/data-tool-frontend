import { useSearchParams, createSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

const useQueryString = (query) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsObject = useMemo(() => {
    const searchParamsObject = {};
    [...searchParams].forEach(([key, value]) => {
      if (searchParamsObject[key]) {
        if (Array.isArray(searchParamsObject[key])) {
          searchParamsObject[key].push(value);
        } else {
          searchParamsObject[key] = [searchParamsObject[key], value];
        }
        return;
      }
      searchParamsObject[key] = value;
    });
    return searchParamsObject;
  }, [searchParams]);

  const parseQueryString = (queryString) => {
    const searchParams = createSearchParams(queryString);
    return searchParams;
  };

  return {
    queryString: { ...searchParamsObject, ...query },
    setQueryString: (params) => {
      setSearchParams(params);
    },
    parseQueryString,
  };
};

export default useQueryString;
