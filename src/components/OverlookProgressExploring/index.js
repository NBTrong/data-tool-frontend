import React from 'react';
import CardWithoutPadding from '../CardWithoutPadding';
import {Stack} from 'react-bootstrap';
import {ThreeDots} from 'react-loader-spinner';

import cn from 'classnames';
import {getTiktokUsername} from "../../utils/helpers";
import Progress from "../Progress";
import {useEffect, useMemo, useState} from "react";
import {Collapse} from "bootstrap"
import {
    AiFillClockCircle,
    AiFillCloseCircle,
    AiOutlineClose,
    AiOutlineCloseCircle,
    AiOutlineReload
} from "react-icons/ai";
import ImageEnsure from "../ImageEnsure";
import {LoadingCircle, Tooltip} from "../index";
import LazyLoading from "../LazyLoading";
import Loading3Dots from "../Loading3Dots";


function OverlookProgressExploring({
                                       lists = [],
                                        onRemove,
                                        onRetry,
                                   }) {
    const getProgress = (posts_count,total,status) => {
        if (status === "finished") return 100;
        const percent = (posts_count / total) * 100;
        return (percent && percent <= 100) ? percent : (!percent ? 0 : 100);
    }

    const getStatusColor = (status) => {
        const colors = [
            {
                status: "waiting",
                color: "#6f767e"
            },
            {
                status: "searching",
                color: "#fea316"
            },
            {
                status: "crawling",
                color: "#fea316"
            },
            {
                status: "finished",
                color: "#2ad455"
            },
            {
                status: "notfound",
                color: "red"
            }
        ]
        return (colors.find(s => s?.status?.toLowerCase() === status?.toLowerCase())?.color || "#adadad")
    }

    return (
        <>
            <Stack direction="horizontal"
                   className="row mt-4 row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4 mb-4 gx-3">
                {lists?.map(channel => {
                    return (
                        <div className={'col custom-hover'}>
                            <div className={'shadow-sm rounded-3 p-2'}>
                                <div className={'d-flex justify-content-between align-items-stretch'}>
                                    <a href={`https://www.tiktok.com/@${getTiktokUsername(channel?.name)}`}
                                       target={"_blank"}
                                       className={'d-flex align-items-center w-100'} style={{maxWidth: "80%"}}>
                                        <ImageEnsure src={channel?.user?.avatar_thumb ?? "false"} className={'logo-md me-2'} srcOnError={"/images/content/tiktok.gif"}/>
                                        <Tooltip title={"@" + getTiktokUsername(channel?.name)} children={
                                            <div className={'text-gray fw-bold word-wrap limit-1-line'} style={{maxWidth: "90%"}}>@{getTiktokUsername(channel?.name)}</div>
                                        } className={'w-100'}/>
                                    </a>
                                    <div className={'hover-show'}>
                                        {/*<button onClick={()=>{*/}
                                        {/*    onRetry(channel?.name)*/}
                                        {/*}} className={'text-gray me-2'}><AiOutlineReload className={"fw-bold"}/></button>*/}
                                        <button onClick={()=>{
                                            onRemove(channel?.name)
                                        }} className={'text-gray'}><AiOutlineClose className={"fw-bold"}/></button>
                                    </div>
                                </div>

                                <div className={'mt-2'}>
                                    <Progress percent={getProgress(channel?.posts_count,channel?.user?.total_posts,channel?.status)} style={{maxHeight: "10px"}} className={'w-100'}/>
                                </div>
                                <div className={'text-gray d-flex justify-content-between'}>
                                    <div className={'d-flex align-items-center'}>
                                        <span className={'logo d-inline-block me-2'} style={{backgroundColor: `${getStatusColor(channel?.status)}`, width: "10px",height: "10px"}}></span>
                                        <small className={'text-capitalize'}>{channel?.status}</small>
                                    </div>
                                    <div><small>{channel?.posts_count}/{channel?.user?.total_posts ?? '...'} posts</small></div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </Stack>
        </>
    );
}

export default OverlookProgressExploring;
