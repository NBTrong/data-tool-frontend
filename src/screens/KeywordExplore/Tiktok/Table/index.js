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
import useQueryString from '../../../../hooks/useQueryString';
import Empty from '../../../ExtractVideo/Table/Empty';
import SkeletonTable from './Skeleton';

import { DataCrawledContext } from '../index';

const Table = ({
  className,
  keywords,
  setCountResult,
  setTypeFilter,
  setFileExport,
}) => {
  const [activeNav, setActiveNav] = useState('post');
  const [isShowLoadMore, setIsShowLoadMore] = useState(false);
  const [startOffset, setStartOffset] = useState(0);
  const [numberPosts, setNumberPosts] = useState(350);
  const [isLoading, setIsLoading] = useState(false);
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
        case 'save':
          field = 'total_saves';
          break;
        case 'videos':
          field = 'videos_length';
          break;
        case 'uploaded':
          field = 'created_at';
          break;
        case 'latest_content':
          field = 'latest_content';
          break;
        default:
          field = `total_${orderBy}`;
          break;
      }

      if (field) {
        data.sort((a, b) => {
          if (field === 'videos_length') {
            a[field] = a.videos?.length || 0;
            b[field] = b.videos?.length || 0;
          }

          if (field === 'total_followers') {
            a[field] = a.author?.follower_count || 0;
            b[field] = b.author?.follower_count || 0;
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
    let result = dataCrawled?.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t?.id === item?.id) &&
        keywords.some((key) => {
          return key.text === item?.keyword;
        }),
    );

    if (from) {
      result = result.filter((item) => item.created_at >= from);
    }
    if (to) {
      result = result.filter((item) => item.created_at <= to);
    }
    result.sort((a, b) => {
      return a.offset - b.offset;
    });
    return applySoftData(result);
  }, [dataCrawled, keywords, from, to, orderBy, sortBy, activeNav]);

  const handleSort = useCallback(
    (orderBy) => {
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
      if (activeNav === 'post') {
        switch (orderBy) {
          case 'views':
            setDisplayIcon([
              `${mode}`,
              'default',
              'default',
              'default',
              'default',
              'default',
            ]);
            break;
          case 'likes':
            setDisplayIcon([
              'default',
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
              'default',
              `${mode}`,
              'default',
              'default',
              'default',
            ]);
            break;
          case 'shares':
            setDisplayIcon([
              'default',
              'default',
              `default`,
              `${mode}`,
              'default',
              'default',
            ]);
            break;
          case 'save':
            setDisplayIcon([
              'default',
              'default',
              `default`,
              'default',
              mode,
              'default',
            ]);
            break;
          case 'uploaded':
            setDisplayIcon([
              'default',
              'default',
              `default`,
              'default',
              'default',
              mode,
            ]);
            break;
          default:
            break;
        }
      }
      if (activeNav === 'KOC') {
        switch (orderBy) {
          case 'videos':
            setDisplayIcon([
              `${mode}`,
              'default',
              'default',
              'default',
              'default',
              'default',
            ]);
            break;
          case 'followers':
            setDisplayIcon([
              'default',
              `${mode}`,
              'default',
              'default',
              'default',
              'default',
            ]);
            break;
          case 'views':
            setDisplayIcon([
              'default',
              'default',
              `${mode}`,
              'default',
              'default',
              'default',
            ]);
            break;
          case 'likes':
            setDisplayIcon([
              'default',
              'default',
              'default',
              `${mode}`,
              'default',
              'default',
            ]);
            break;
          case 'uploaded':
            setDisplayIcon([
              'default',
              'default',
              'default',
              'default',
              `${mode}`,
              'default',
            ]);
            break;
          default:
            break;
        }
      }
      setSortMode(!sortMode);
      setQueryString({ ...queryString, ...params });
    },
    [activeNav, sortMode, orderBy, queryString],
  );

  useEffect(() => {
    if (activeNav === 'KOC') {
      handleSort(orderBy);
    }
    if (activeNav === 'post') {
      handleSort(orderBy);
    }
  }, [orderBy]);

  const parseKOCData = useCallback(
    (data) => {
      const result = Object.values(
        data.reduce((acc, video) => {
          const authorId = video?.author?.unique_id;

          if (!acc[authorId]) {
            acc[authorId] = {
              author: video?.author,
              total_views: 0,
              total_likes: 0,
              videos: [],
              latest_content: null,
            };
          }

          acc[authorId].total_views += video?.total_views;
          acc[authorId].total_likes += video?.total_likes;
          acc[authorId].latest_content =
            acc[authorId]?.latest_content < video?.created_at
              ? video?.created_at
              : acc[authorId]?.latest_content;
          acc[authorId].videos.push(video?.video);

          return acc;
        }, {}),
      );
      return applySoftData(result);
    },
    [sortBy, orderBy],
  );

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

  useEffect(() => {
    if (filterDataCrawled && filterDataCrawled.length) {
      setIsShowLoadMore(true);
    } else setIsShowLoadMore(false);
  }, [filterDataCrawled]);

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

  const exploringHtml = () => {
    return `
            <div class="spinner-border spinner-border-sm text-muted" style="opacity: 0.6" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
        `;
  };

  const onActionLoadMore = useCallback(() => {
    const average = Math.floor(300 / keywords.length);
    setStartOffset(numberPosts);
    setNumberPosts(numberPosts + average);
  }, [numberPosts, keywords]);

  return (
    <>
      <div className={'d-flex justify-content-between mb-2'}>
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
        {/*<div>*/}
        {/*    <button className={cn(styles.btnLoadMore, 'btn btn-light d-flex align-items-center', isShowLoadMore || isLoading ? "" : "d-none")}*/}
        {/*            onClick={onActionLoadMore}*/}
        {/*            disabled={isLoading}>*/}
        {/*        {isLoading ? (*/}
        {/*            <>*/}
        {/*                Exploring*/}
        {/*                <div className="spinner-border spinner-border-sm ms-2" role="status">*/}
        {/*                    <span className="visually-hidden">Loading...</span>*/}
        {/*                </div>*/}
        {/*            </>*/}
        {/*        ) : (*/}
        {/*            <>*/}
        {/*                Load more<MdDownloading className={"ms-2 fs-5"}/>*/}
        {/*            </>*/}
        {/*        )}*/}
        {/*    </button>*/}
        {/*</div>*/}
      </div>
      <div className={cn(styles.wrapper, className)}>
        <div className={cn(styles.table)}>
          <div className={cn(styles.row)}>
            {activeNav === 'post' && (
              <PostHeading displayIcon={displayIcon} handleSort={handleSort} />
            )}
            {activeNav === 'KOC' && (
              <KocHeading displayIcon={displayIcon} handleSort={handleSort} />
            )}
          </div>
          {activeNav === 'post' && <RowPost posts={filterDataCrawled} />}
          {activeNav === 'KOC' && (
            <RowKOC KOCs={parseKOCData(filterDataCrawled)} />
          )}
          {keywords && (
            <Crawler
              numberPosts={numberPosts}
              keywords={keywords}
              startOffset={startOffset}
              setIsLoading={setIsLoading}
            />
          )}
          {isLoading && <SkeletonTable limit={5} />}
        </div>
      </div>
      {!filterDataCrawled.length && !keywords.length && !isLoading && (
        <Empty title={'Data empty'} description={'Enter keyword to explore'} />
      )}
      <div className={'d-flex justify-content-center mt-4'}>
        <button
          className={cn(
            styles.btnLoadMore,
            'btn btn-light d-flex align-items-center',
            isShowLoadMore && isLoading ? '' : 'd-none',
          )}
          onClick={onActionLoadMore}
          disabled={isLoading}
        >
          {
            isLoading ? (
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
              ''
            )
            //     : (
            //     <>
            //         Load more<MdDownloading className={"ms-2 fs-5"}/>
            //     </>
            // )
          }
        </button>
      </div>
    </>
  );
};

export default Table;
