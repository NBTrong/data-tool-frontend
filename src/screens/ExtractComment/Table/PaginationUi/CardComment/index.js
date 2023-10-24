import React, {useState, useContext, useMemo, useEffect} from 'react';
import styles from "./ItemComment.module.sass";
import ImageEnsure from "../../../../../components/ImageEnsure";
import Collapse from 'react-bootstrap/Collapse';
import cn from "classnames";
import {FiChevronRight} from "react-icons/fi";
import {ItemComment} from "./ItemComment/ItemComment";
import {DataCrawledContext} from "../../../index";
import {FaRegCommentDots} from "react-icons/fa";

const CardComment = ({item,indexPost})=>{
    const [open, setOpen] = useState(true);
    const { handleCrawlAllPostComment,activeCrawlComment,maxCursor } = useContext(DataCrawledContext);
    const max_comments = item?.statistics?.comment_count

    const isLoading = function () {
        if (item?.no_more_comments === true){
            return !item?.no_more_comments;
        }
        return item?.comments === undefined ||
            ((+item?.comments?.length < +max_comments && activeCrawlComment[item?.url] === true && item?.comments?.length < maxCursor) || activeCrawlComment[item?.url] === Infinity)
    }()

    const isHaveMore = (+item?.comments?.length < max_comments && activeCrawlComment[item?.url] !== Infinity) && !isLoading

    const totalComments = function (){
        let total = item?.comments?.length || 0;
        item?.comments?.forEach(comment=>total += (comment?.replies?.length || 0))
        return total;
    }();

    return (
        <div className={cn("mb-4 w-100 overflow-hidden",styles.card)}>
            <div
                onClick={() => setOpen(!open)}>
                <div className={'d-md-flex align-items-center justify-content-between px-3'}>
                    <div className={'d-flex align-items-center'}>
                        <ImageEnsure src={item?.thumb_url} srcOnError={"/images/content/tiktok.gif"} className={styles.thumbnail}/>
                        <div className={'ms-2'}>
                            <div className={'limit-3-line'}>{item?.title}</div>
                            <a href={item?.url} target={"_blank"} className={'word-break limit-2-line'}>{item?.url}</a>
                        </div>
                    </div>
                    <div className={'d-flex align-items-center pe-2 ps-4 mt-md-0 mt-4'}>
                        <div className={'pe-4 text-nowrap d-flex align-items-center'}>
                            Total comments &nbsp; <span className={item?.no_more_comments ? 'status-green' : 'status-default'}>{totalComments || 0}/{max_comments ?? 0}</span>
                            {(!item?.no_more_comments && isLoading) && (
                                <div className={'px-2 text-gray d-flex align-items-center'}>
                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <FiChevronRight className={'fs-4 text-gray transform-all'} style={{"rotate": open && "90deg"}}/>
                    </div>
                </div>
            </div>
            <Collapse in={open}>
                <div>
                    {!!item?.comments?.length && (
                        <div className={cn(styles.border_top,'my-4 px-3 pt-2')}>
                            {item?.comments?.map((comment,indexComment)=> <ItemComment comment={comment} index={indexComment} indexPost={indexPost} aweme_id={item?.post_id}/> )}
                        </div>
                    )}
                    {isHaveMore && (
                        <div onClick={()=>handleCrawlAllPostComment(item?.url)} className={'cursor-pointer px-3 text-gray fw-bold'}>
                            View all {max_comments - totalComments} comments
                            <FaRegCommentDots className={'ms-2'}/>
                        </div>
                    )}
                    {(!item?.no_more_comments && isLoading) && (
                        <div className={'px-3 text-gray d-flex align-items-center mt-2'}>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <small>Processing {max_comments - totalComments} comments left</small>
                        </div>
                    )}
                </div>
            </Collapse>
        </div>
    )
}

export default CardComment
