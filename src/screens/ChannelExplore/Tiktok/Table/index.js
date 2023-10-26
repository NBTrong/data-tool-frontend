import React, {
    useState,
    useContext,
    useEffect,
    useMemo,
    useCallback, createContext,
} from 'react';

import cn from 'classnames';
import styles from './Table.module.sass';

import Crawler from './Crawler';
import KocHeading from './Nav/KOC/Heading';
import PostHeading from './Nav/Post/Heading';
import {DataCrawledContext} from '../index';
import useQueryString from '../../../../hooks/useQueryString';
import Empty from '../../../ExtractVideo/Table/Empty';
import OverlookProgressExploring from "../../../../components/OverlookProgressExploring";
import PaginationUi from "../../Tiktok/Table/PaginationUi";

export const TableContext = createContext();

const Table = ({
                   className,
                   keywords,
                   setCountResult,
                   setTypeFilter,
                   setFileExport,
                   removeKeyword,
               }) => {
    const [activeNav, setActiveNav] = useState('post');
    const [isLoading, setIsLoading] = useState(false);
    const [limitCount, setLimitCount] = useState(10);
    const [overlookLists, setOverlookLists] = useState([]);
    // const [setIsShowLoadMore] = useState(false);
    const {dataCrawled} = useContext(DataCrawledContext);
    const {queryString} = useQueryString();
    const {orderBy, sortBy} = queryString;
    const [sortMode, setSortMode] = useState(null);
    const {from, to,hashtags} = queryString;
    const [displayIcon, setDisplayIcon] = useState([
        'default',
        'default',
        'default',
        'default',
        'default',
        'default',
    ]);


    useEffect(() => {
        const change = ()=>{
            if (overlookLists.length !== keywords.length){
                return true
            } else {
                return !!(overlookLists.filter(({name}) => !keywords?.find(k=>k.text === name))).length
            }
        }
        if (change()){
            let list = [...overlookLists];
            keywords?.map(({text}) => {
                const channel = {
                    name: (text),
                    status: "waiting",
                    posts_count: 0,
                    cursors: []
                }
                if (!list?.find(s => s?.name === text)) {
                    list.push(channel)
                }
            })
            list = list?.filter((i)=>{
                return !!keywords?.find((k)=>{
                    return k?.text === i?.name
                })
            })
            setOverlookLists(list);
        }
    }, [keywords,overlookLists])

    const handleUpdateOverlookLists = useCallback((itemUpdate) => {
        const list = overlookLists;
        const old = list?.find(i => i.name === itemUpdate.name);
        const index = list.indexOf(old);
        list[index] = {
            ...old,
            user: itemUpdate?.user,
            status: itemUpdate?.status,
        };
        if (!old?.cursors.includes(itemUpdate.maxCursor)){
            list[index]?.cursors?.push(itemUpdate.maxCursor);
            list[index].posts_count = itemUpdate?.posts_plush ? old?.posts_count + itemUpdate?.posts_plush : old?.posts_count;
        }
        setOverlookLists(list)
    }, [overlookLists])

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
                index === self?.findIndex((t) => t?.id === item?.id) &&
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
        if (hashtags) {
            const hashtagsArr = hashtags.split(",")
            result = result.filter((item) => {
                return !!hashtagsArr?.find(hashtag=>item?.name?.includes(hashtag))
            });
        }
        result.sort((a, b) => {
            return a.offset - b.offset;
        });
        return applySoftData(result);
    }, [dataCrawled, keywords, from, to, orderBy, sortBy, activeNav,hashtags]);

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
        // setQueryString(from && to ? {from, to} : {});
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

    const parseKOCData = useCallback((data) => {
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
        return result.filter((i) => {
            return !!i.author?.unique_id;
        });
    }, []);

    const onActionLoadMore = useCallback(() => {
        setLimitCount(limitCount + 10);
    }, [limitCount]);

    // useEffect(() => {
    //     // console.log(!!dataCrawled.length)
    //     // console.log(!!isLoading)
    //     // console.log(!!keywords.length)
    //     // console.log(!!filterDataCrawled.length)
    //     // if (keywords.length || (dataCrawled.length && !isLoading)) {
    //     //     setIsShowLoadMore(true);
    //     // }
    //     // if (
    //     //     !keywords.length ||
    //     //     (keywords.length && !filterDataCrawled.length && !isLoading)
    //     // )
    //     // {
    //     //     setIsShowLoadMore(false);
    //     // }
    //     if (keywords.length && isLoading) {
    //         setIsShowLoadMore(true);
    //     }
    // }, [keywords, isLoading, dataCrawled]);

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
                    case 'latest_content':
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
            // setQueryString({...queryString, ...params});
        },
        [activeNav, sortMode, orderBy, queryString],
    );

    return (
        <TableContext.Provider value={{handleUpdateOverlookLists}}>
            <>
                <div className={'mb-2'}>
                    {navigation.map((x, index) => (
                        <button
                            className={cn(styles.link, 'text-nowrap cursor-pointer border-0', {
                                [styles.active]: x.active,
                            })}
                            onClick={() => {
                                changeActive(x.id);
                            }}
                            key={index}
                        >
                            {x.title}
                        </button>
                    ))}
                </div>
                <OverlookProgressExploring lists={overlookLists} onRemove={removeKeyword}/>
                <div className={cn(styles.wrapper, className)}>
                    <div className={cn(styles.table)}>
                        <div className={cn(styles.row)}>
                            {activeNav === 'post' && (
                                <PostHeading displayIcon={displayIcon} handleSort={handleSort}/>
                            )}
                            {activeNav === 'KOC' && (
                                <KocHeading displayIcon={displayIcon} handleSort={handleSort}/>
                            )}
                        </div>
                        <PaginationUi activeNav={activeNav} array={activeNav === 'post' ? filterDataCrawled : parseKOCData(filterDataCrawled)} isLoading={isLoading}/>
                        {keywords && (
                            <Crawler
                                setIsLoading={setIsLoading}
                                keywords={keywords}
                                limitCount={limitCount}
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
            </>
        </TableContext.Provider>
    );
};

export default Table;
