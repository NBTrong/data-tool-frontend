import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import cn from 'classnames';
import styles from './Table.module.sass';

import Crawler from './Crawler';
import RowKOC from './Nav/KOC/Row';
import RowPost from './Nav/Post/Row';
import KocHeading from './Nav/KOC/Heading';
import PostHeading from './Nav/Post/Heading';
import { DataCrawledContext } from '../index';
import useQueryString from '../../../../hooks/useQueryString';
import Empty from '../../../ExtractVideo/Table/Empty';
import { MdDownloading } from 'react-icons/md';
import SkeletonTable from './Skeleton';
import PaginationUi from "../../Instagram/Table/PaginationUi";
import {AiTwotoneFolderOpen} from "react-icons/ai";

const Table = ({
  className,
  keywords,
  setCountResult,
  setTypeFilter,
  setFileExport,
}) => {
  const plushCount = 100;
  const [activeNav, setActiveNav] = useState('post');
  const [isLoading, setIsLoading] = useState(false);
  const [limitPage, setLimitPage] = useState(1000000);
  const [isShowLoadMore, setIsShowLoadMore] = useState(false);
  const { dataCrawled } = useContext(DataCrawledContext);
  const { queryString, setQueryString } = useQueryString();
  const { orderBy, sortBy } = queryString;
  const [sortMode, setSortMode] = useState(null);
  const { from, to } = queryString;
  const [displayIcon, setDisplayIcon] = useState([
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
  ]);

  const applySoftData = useCallback((data) => {
    if (orderBy && sortBy) {
      let field;
      switch (orderBy) {
        case 'uploaded':
          field = 'created_at';
          break;
        case 'posts':
          field = 'posts_length';
          break;
        default:
          field = `total_${orderBy}`;
          break;
      }
      if (field) {
        data.sort((a, b) => {
          if (field === 'posts_length') {
            a[field] = a.posts?.length || 0;
            b[field] = b.posts?.length || 0;
          }
          if (sortBy === 'DESC') {
            return b[field] - a[field]; // Giảm dần
          }
          if (sortBy === 'ASC') {
            return a[field] - b[field]; // Giảm dần
          }
        });
      }
    }
    return data;
  });

  const filterDataCrawled = useMemo(() => {
    let result = dataCrawled.post?.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t?.id === item?.id) &&
        keywords.some((key) => key.text === item?.keyword),
    );

    if (from) {
      result = result.filter((item) => item.created_at >= from);
    }
    if (to) {
      result = result.filter((item) => item.created_at <= to);
    }
    result = result.map((i) => {
      i.author =
        dataCrawled?.KOC?.find(
          (item) => item.username === i?.author?.unique_id,
        ) || i?.author;
      return i;
    });
    return applySoftData(result);
  }, [dataCrawled, keywords, from, to, orderBy, sortBy, activeNav]);

  const changeActive = (navId) => {
    setTypeFilter(navId);
    setActiveNav(navId);
    setDisplayIcon([
      'default',
      'default',
      'default',
      'default',
      'default',
      'default',
    ]);
    setQueryString(from && to ? { from, to } : {});
  };

  const exploringHtml = useCallback(() => {
    return `
            <div class="spinner-border spinner-border-sm text-muted" style="opacity: 0.6" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
        `;
  }, []);

  useEffect(() => {
    if (keywords.length) {
      const exploring = isLoading ? exploringHtml() : '';
      if (activeNav === 'post') {
        setCountResult(filterDataCrawled.length + '+ Posts' + exploring);
        setFileExport(filterDataCrawled);
      }
      if (activeNav === 'KOC') {
        const dataKOCs = parseKOCData(filterDataCrawled);
        setCountResult(dataKOCs.length + '+ KOCs' + exploring);
        setFileExport(dataKOCs);
      }
    } else {
      setCountResult(0 + ' Results');
    }
  }, [dataCrawled, activeNav, filterDataCrawled, keywords, isLoading]);

  const navigation = useMemo(() => {
    return [
      {
        id: 'post',
        title: 'Videos',
        active: activeNav === 'post',
      },
      {
        id: 'KOC',
        title: 'Unique KOCs',
        active: activeNav === 'KOC',
      },
    ];
  }, [activeNav]);

  const handleSortTabPosts =
    ((orderBy) => {
      if (!orderBy) {
        return;
      }
      let mode;
      if (sortMode) {
        mode = 'DESC';
      } else mode = 'ASC';
      const params = {
        ...queryString,
      };
      if (params.orderBy) {
        delete params.orderBy;
      }
      if (params.sortBy) {
        delete params.sortBy;
      }

      params.orderBy = orderBy;
      params.sortBy = mode;
      params.page = 1;
      switch (orderBy) {
        case 'likes':
          setDisplayIcon([
            `${mode}`,
            'default',
            'default',
            'default',
            'default',
          ]);
          break;
        case 'comments':
          setDisplayIcon([
            'default',
            `${mode}`,
            'default',
            'default',
            'default',
          ]);
          break;
        case 'uploaded':
          setDisplayIcon([
            'default',
            'default',
            `${mode}`,
            'default',
            'default',
          ]);
          break;
        default:
          break;
      }
      setSortMode(!sortMode);
      setQueryString({ ...queryString, ...params });
    },
    [queryString]);

  const handleSortTabKOCs = (orderBy) => {
    if (!orderBy) {
      return;
    }
    let mode;
    if (sortMode) {
      mode = 'DESC';
    } else mode = 'ASC';
    const params = {
      ...queryString,
    };
    if (params.orderBy) {
      delete params.orderBy;
    }
    if (params.sortBy) {
      delete params.sortBy;
    }

    params.orderBy = orderBy;
    params.sortBy = mode;
    params.page = 1;
    switch (orderBy) {
      case 'posts':
        setDisplayIcon([`${mode}`, 'default', 'default', 'default', 'default']);
        break;
      case 'likes':
        setDisplayIcon(['default', `${mode}`, 'default', 'default']);
        break;
      case 'comments':
        setDisplayIcon(['default', 'default', `${mode}`, 'default', 'default']);
        break;
      case 'uploaded':
        setDisplayIcon(['default', 'default', 'default', `${mode}`, 'default']);
        break;

      default:
        break;
    }
    setSortMode(!sortMode);
    setQueryString(params);
  };

  useEffect(() => {
    if (activeNav === 'KOCs') {
      handleSortTabKOCs(orderBy);
    }
    if (activeNav === 'posts') {
      handleSortTabPosts(orderBy);
    }
  }, [orderBy]);

  const parseKOCData = useCallback(
    (data) => {
      const KOCs = Object.values(
        data.reduce((acc, post) => {
          const authorId = post?.author?.unique_id;

          if (!acc[authorId]) {
            acc[authorId] = {
              author: post?.author,
              total_views: 0,
              total_likes: 0,
              total_comments: 0,
              posts: [],
              latest_content: null,
            };
          }

          acc[authorId].total_views += post?.total_views;
          acc[authorId].total_likes += post?.total_likes;
          acc[authorId].total_comments += post?.total_comments;
          acc[authorId].latest_content =
            acc[authorId]?.latest_content < post?.created_at
              ? post?.created_at
              : acc[authorId]?.latest_content;
          acc[authorId].posts.push(post?.post);
          return acc;
        }, {}),
      );
      const result = KOCs.filter((i) => {
        return !!i.author?.unique_id;
      });
      return applySoftData(result);
    },
    [sortBy, orderBy],
  );

  const onActionLoadMore = useCallback(() => {
    setLimitPage(limitPage + plushCount);
  }, [limitPage]);

  useEffect(() => {
    // console.log(!!dataCrawled.length)
    // console.log(!!isLoading)
    // console.log(!!keywords.length)
    // console.log(!!filterDataCrawled.length)
    if (keywords.length || (dataCrawled.length && !isLoading)) {
      setIsShowLoadMore(true);
    }
    if (
      !keywords.length ||
      (keywords.length && !filterDataCrawled.length && !isLoading)
    ) {
      setIsShowLoadMore(false);
    }
    if (keywords.length && isLoading) {
      setIsShowLoadMore(true);
    }
  }, [keywords, isLoading, dataCrawled]);

  return (
    <>
      <div className={'mb-2 d-flex justify-content-between'}>
        <div>
          {navigation.map((x, index) => (
            <button
              className={cn(
                styles.link,
                'text-nowrap cursor-pointer border-0',
                {
                  [styles.active]: x.active,
                },
              )}
              onClick={() => {
                changeActive(x.id);
              }}
              key={index}
            >
              {x.title}
            </button>
          ))}
        </div>
        <div>
          {/*<button*/}
          {/*  className={cn(*/}
          {/*    styles.btnLoadMore,*/}
          {/*    'btn btn-light d-flex align-items-center text-nowrap fs-mobile',*/}
          {/*    keywords.length && !isLoading ? '' : 'd-none',*/}
          {/*  )}*/}
          {/*  onClick={onActionLoadMore}*/}
          {/*  disabled={isLoading}*/}
          {/*>*/}
          {/*  {isLoading ? (*/}
          {/*    <>*/}
          {/*      Exploring*/}
          {/*      <div*/}
          {/*        className="spinner-border spinner-border-sm ms-2"*/}
          {/*        role="status"*/}
          {/*      >*/}
          {/*        <span className="visually-hidden">Loading...</span>*/}
          {/*      </div>*/}
          {/*    </>*/}
          {/*  ) : (*/}
          {/*    <>*/}
          {/*      Load more*/}
          {/*      <MdDownloading className={'ms-2 fs-5'} />*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</button>*/}
        </div>
      </div>
      <div className={cn(styles.wrapper, className)}>
        <div className={cn(styles.table)}>
          <div className={cn(styles.row)}>
            {activeNav === 'post' && (
              <PostHeading
                displayIcon={displayIcon}
                handleSort={handleSortTabPosts}
              />
            )}
            {activeNav === 'KOC' && (
              <KocHeading
                displayIcon={displayIcon}
                handleSort={handleSortTabKOCs}
              />
            )}
          </div>
          <PaginationUi activeNav={activeNav} array={activeNav === 'post' ? filterDataCrawled : parseKOCData(filterDataCrawled)} isLoading={isLoading}/>
          {!!keywords.length && (
            <Crawler
              setIsLoading={setIsLoading}
              keywords={keywords}
              limitPage={limitPage}
            />
          )}
        </div>
      </div>
      {!filterDataCrawled.length && !keywords.length && (
        <Empty
          title={'Data empty'}
          description={'Enter channel url to explore'}
        />
      )}
      <div className={'mt-2'}>
        <div className={'d-flex justify-content-center w-100 position-absolute'}>
          <button
              className={cn(
                  styles.btnLoadMore,
                  'btn btn-light d-flex align-items-center',
                  isShowLoadMore ? '' : 'd-none',
              )}
              onClick={onActionLoadMore}
              disabled={true}
          >
            {isLoading ? (
                <>
                  Exploring
                  <div
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </>
            ) : (
                <>
                  Out of data
                  <AiTwotoneFolderOpen className={'ms-2 fs-5'}/>
                </>
            )}
          </button>
        </div>
        <div className={'d-flex justify-content-center w-100'} style={{opacity: 0}}>
          <button
              className={cn(
                  styles.btnLoadMore,
                  'btn btn-light d-flex align-items-center',
                  isShowLoadMore ? '' : 'd-none',
              )}
              onClick={onActionLoadMore}
              disabled={true}
          >
            {isLoading ? (
                <>
                  Exploring
                  <div
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </>
            ) : (
                <>
                  Out of data
                  <AiTwotoneFolderOpen className={'ms-2 fs-5'}/>
                </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;
