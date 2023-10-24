import styles from "../ItemComment.module.sass";
import ImageEnsure from "../../../../../../components/ImageEnsure";
import {formatTimeAgo} from "../../../../../../utils/helpers";
import {FiChevronDown, FiChevronRight, FiHeart} from "react-icons/fi";
import React, {useState} from 'react';
import Collapse from "react-bootstrap/Collapse";

export const ItemComment = ({comment})=>{
    const [activeReply,setActiveReply]= useState(true);
    const [openCollapse,setOpenCollapse]= useState(true);
    const isLoadingReply = comment?.replies?.length < comment?.reply_comment_total && !comment.no_more_replies;

    return (
        <div className={'d-flex mb-4'}>
            <a href={comment?.user?.url} target={"_blank"}>
                <ImageEnsure src={comment?.user?.avatar_thumb} className={styles?.logo}/>
            </a>
            <div className={'lh-sm ms-2'}>
                <a href={comment?.user?.url} target={"_blank"}>
                    <b className={"text-black"}>{comment?.user?.nickname}</b>
                </a>
                <div style={{opacity: "0.9"}}>
                    <small>{comment?.text}</small>
                </div>
                <div className={'text-gray'}>
                    <small>
                        {formatTimeAgo(comment?.create_time)} · {comment?.like_count} <FiHeart className={'ms-1'}/>
                    </small>
                </div>
                {(!!comment?.reply_comment_total) && (
                    <div>
                        {!activeReply && (
                            <div className={'d-flex align-items-center text-gray'}>
                                <hr style={{width: "25px"}}/>
                                <small onClick={()=>{
                                    // setIsLoadingReply(true)
                                    setActiveReply(true)
                                }}
                                       className={'cursor-pointer'}>View {comment?.reply_comment_total} replies <FiChevronDown/></small>
                            </div>
                        )}
                        {activeReply &&  (
                            <div className={'d-flex align-items-center text-gray'}
                            onClick={()=>setOpenCollapse(!openCollapse)}>
                                <hr style={{width: "25px"}}/>
                                <small className={'me-2'}>Total {comment?.replies?.length}/{comment?.reply_comment_total} replies</small>
                                {isLoadingReply && (
                                    <div className="spinner-border spinner-border-sm text-gray" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                                <FiChevronRight className={'fs-6 text-gray transform-all'} style={{"rotate": openCollapse && "90deg"}}/>
                            </div>
                        )}
                        {(!!comment?.replies && !!comment?.replies?.length) && (
                            <Collapse in={openCollapse}>
                                <div>
                                    {comment?.replies?.map((reply,i)=>{
                                        return (
                                            <div className={`d-flex ${(comment?.replies.length === (i + 1)) ? 'mb-0' : 'mb-4'}`}>
                                                <a href={reply?.user?.unique_id} target={"_blank"}>
                                                    <ImageEnsure src={reply?.user?.avatar_thumb} className={styles?.logo}/>
                                                </a>
                                                <div className={'lh-sm ms-2'}>
                                                    <b>{reply?.user?.nickname}</b>
                                                    <div style={{opacity: "0.9"}}>
                                                        <small>{reply?.text}</small>
                                                    </div>
                                                    <div className={'text-gray'}>
                                                        <small>
                                                            {formatTimeAgo(reply?.create_time)} · {reply?.like_count} <FiHeart className={'ms-1'}/>
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })} &nbsp;
                                </div>
                            </Collapse>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
