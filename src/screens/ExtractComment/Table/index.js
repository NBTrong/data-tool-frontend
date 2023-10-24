import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';

import cn from 'classnames';
import styles from './Table.module.sass';

import {DataCrawledContext} from "../index";
import Crawler from "./Crawler";
import PaginationUi from "./PaginationUi";
import Empty from "./Empty";
import useQueryString from "../../../hooks/useQueryString";
import {Icon} from "../../../components";
import Tooltip from "../../../components/Tooltip";
import {BsStopCircleFill} from "react-icons/bs";
import CardWithoutPadding from "../../../components/CardWithoutPadding";
import {toast} from "react-toastify";

export const TableContext = createContext([]);

const Table = ({className, fileData}) => {
    const {dataCrawled, maxCursor,activeCrawlComment,setMaxCommentsCursor,handleActiveCrawlComment} = useContext(DataCrawledContext);
    const {queryString, setQueryString} = useQueryString();
    const [totalCommentCrawled,setTotalCommentCrawled] = useState(0);
    const [totalCommentCount,setTotalCommentCount] = useState(0);

    const handleSetTotalCommentCrawled = useCallback((count)=>{
        setTotalCommentCrawled(totalCommentCrawled + count)
    },[totalCommentCrawled])

    const handleSetTotalCommentCount = useCallback((count)=>{
        setTotalCommentCount(totalCommentCount + count)
    },[totalCommentCount])


    useEffect(()=>{
        setTotalCommentCrawled(0)
        setTotalCommentCount(0)
    },[fileData])

    //
    // const totalCommentCrawled = useMemo(()=>{
    //     return dataCrawled.reduce((total, item) => total + (item?.comments?.length || 0), 0);
    // },[dataCrawled])
    //
    // const totalCommentCount = useMemo(()=>{
    //     const total = dataCrawled.reduce((total, item) => {
    //         if (item?.no_more_comment !== undefined) {
    //             return total + (item?.comments?.length || 0);
    //         } else {
    //             return total + (item?.statistics?.comment_count || 0);
    //         }
    //     }, 0);
    //     return total;
    // },[dataCrawled])

    const isLoading = useMemo(()=>{
        return (
            totalCommentCrawled < totalCommentCount
            && Object.values(activeCrawlComment).some(value => value !== false)
            && dataCrawled.find((item)=>{
                return (activeCrawlComment[item?.url] === Infinity && (item?.comments?.length < item?.statistics?.comment_count))
                    || item?.comments === undefined
                    || (item?.comments?.length < item?.statistics?.comment_count
                    && item?.comments?.length < maxCursor
                    && !item?.no_more_comments
                )
            })
        );
    },[totalCommentCrawled,totalCommentCount,dataCrawled,maxCursor,activeCrawlComment])

    const onTodoChange = useCallback((e)=>{
        const key = e.nativeEvent.data
        if (!isNaN(key)){
            const value = e.target.value;
            setMaxCommentsCursor(value)
        }
    },[])

    const handleSetOptionComment = useCallback((value)=>{
        setMaxCommentsCursor(value);
        handleActiveCrawlComment("",true)
    },[handleActiveCrawlComment,setMaxCommentsCursor])

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleSetOptionComment(e.target.value)
        }
    };

    const listButtons = useMemo(()=>{
        return [
            {
                label: "Top 20",
                value: 20,
                className: "d-xl-block d-none"
            },
            {
                label: "Top 100",
                value: 100,
                className: "d-xl-block d-none"
            },
            {
                label: "Get all",
                value: Infinity,
                className: ""
            },
        ]
    },[])

    return (
        <TableContext.Provider value={{handleSetTotalCommentCrawled,handleSetTotalCommentCount}}>
            <div className={cn('rounded-3 p-md-4',styles.card_overview)}>
                <CardWithoutPadding title={`${totalCommentCrawled}${totalCommentCount ? "/" + totalCommentCount : ""} Comments
                    ${isLoading ? `<div class="spinner-border spinner-border-sm text-gray" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>` : ""}
                `} classTitle={cn('title-red')}>
                    <div className={'position-relative'}>
                        <div className={'position-absolute'} style={{right: 0, top: "-70px"}}>
                            <Tooltip title={"The number of comments counted may differ from the actual number of comments received. " +
                                "The reason is because there are comments that are deleted, hidden, or contain bad words"} icon={"info"}/>
                        </div>
                    </div>
                    <div className={'d-flex align-items-center justify-content-between lh-sm'}>
                        <div>
                            <div>
                                <Tooltip className={'text-gray mb-2'} title={'Enter the number of comment results for each post'}>
                                    <Icon name={'info'} fill={"#6f767e"}/><small className={'ms-2'}>Enter the number of comment results for each post</small>
                                </Tooltip>
                            </div>
                            <input
                                style={{maxWidth: "300px"}}
                                className={cn(
                                    'TagInput_input__Wm1AN bg-gray input-search',
                                )}
                                value={maxCursor}
                                type="text"
                                onKeyUp={handleKeyUp}
                                onChange={onTodoChange}
                                placeholder="Input max comments"
                                maxLength="256"
                            />
                        </div>
                        <div className={'d-md-block d-none'}>
                            <div className={'text-end'}>
                                <Tooltip className={'text-gray mb-2'} title={'Select one option to set limit total comment results for each post'}>
                                    <Icon name={'info'} fill={"#6f767e"}/>
                                    <small className={'ms-2'}>Get comments using quick options</small>
                                </Tooltip>
                            </div>
                            <div className={'d-flex justify-content-md-end'}>
                                {listButtons.map((btn)=>{
                                    return <button onClick={()=>handleSetOptionComment(btn?.value)}
                                                   className={cn(styles.button_option,btn?.className)}>{btn?.label}</button>
                                })}
                                <button onClick={()=>{
                                    toast.success("Stop all process")
                                    setMaxCommentsCursor(0);
                                    handleActiveCrawlComment("",false)
                                }}
                                        className={styles.button_option} disabled={!isLoading}>
                                    <BsStopCircleFill className={"me-2"}/>
                                    Stop all
                                </button>
                            </div>
                        </div>
                    </div>
                </CardWithoutPadding>
            </div>
            <div className={cn(styles.wrapper, className,"mt-4")} style={{padding: "0 12px"}}>
                {(!!fileData && !!fileData.length) && (
                    <>
                        <Crawler linkList={fileData}/>
                        <PaginationUi array={dataCrawled}/>
                    </>
                )}
                {!(fileData && fileData.length) && (
                    <Empty/>
                )}
            </div>
        </TableContext.Provider>
    );
};

export default Table;
