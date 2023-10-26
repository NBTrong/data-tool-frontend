import React, {useCallback, useState, useMemo, useEffect} from 'react';

import cn from 'classnames';
import ReactPaginate from "react-paginate";
import styles from "../../../../Campaign/Table/Table.module.sass";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import RowPost from "../../../../ChannelExplore/Tiktok/Table/Nav/Post/Row";
import RowKOC from "../../../../ChannelExplore/Tiktok/Table/Nav/KOC/Row";
import SkeletonTable from "../Skeleton";
import useQueryString from "../../../../../hooks/useQueryString";

const perPage = 10;

const PaginationUi = ({array,isLoading,activeNav}) => {
    const [currentPage,setCurrentPage] = useState(1);
    const totalPage = useMemo(() => {
        return array.length / perPage
    }, [array]);

    useEffect(()=>{
        setCurrentPage(1)
    },[activeNav])

    const arraySlice = useMemo(()=>{
        return array.slice((currentPage - 1) * perPage,currentPage * perPage)
    },[array,currentPage])

    const handlePageChange = useCallback(
        ({ selected }) => {
            console.log(selected)
            setCurrentPage(selected + 1);
        },
        [],
    );

    const {queryString} = useQueryString();
    const {hashtags} = queryString;
    const hashtagsArr = useMemo(()=>{
        return hashtags?.split(",")
    },[hashtags])
    return (
        <>
            {activeNav === 'post' && <RowPost posts={arraySlice} hashtagsArr={hashtagsArr}/>}
            {activeNav === 'KOC' && (
                <RowKOC KOCs={arraySlice} />
            )}
            {(isLoading && !array.length) && <SkeletonTable />}
            { (!!array && !!array.length) && (
                <div className={'mb-4'}>
                    <div className={'position-absolute w-100'}>
                        <ReactPaginate
                            activeClassName={cn(styles.item, styles.active)}
                            breakClassName={cn(styles.item)}
                            breakLabel={'...'}
                            marginPagesDisplayed={2}
                            paddingPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            containerClassName={cn(styles.pagination)}
                            // disabledClassName={cn(styles.item, styles.disabled)}
                            nextClassName={cn(styles.item, styles.next)}
                            nextLabel={<IoIosArrowForward />}
                            onPageChange={handlePageChange}
                            pageCount={totalPage}
                            forcePage={currentPage - 1 || 0}
                            pageClassName={cn(styles.item, 'pagination-page')}
                            previousClassName={cn(styles.item, styles.previous)}
                            previousLabel={<IoIosArrowBack />}
                        />
                    </div>
                    <div style={{opacity: "0"}} className={'pointer-event-none-all'}>
                        <ReactPaginate
                            activeClassName={cn(styles.item, styles.active)}
                            breakClassName={cn(styles.item)}
                            breakLabel={'...'}
                            marginPagesDisplayed={2}
                            paddingPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            containerClassName={cn(styles.pagination)}
                            // disabledClassName={cn(styles.item, styles.disabled)}
                            nextClassName={cn(styles.item, styles.next)}
                            nextLabel={<IoIosArrowForward />}
                            onPageChange={handlePageChange}
                            pageCount={totalPage}
                            forcePage={currentPage - 1 || 0}
                            pageClassName={cn(styles.item, 'pagination-page')}
                            previousClassName={cn(styles.item, styles.previous)}
                            previousLabel={<IoIosArrowBack />}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PaginationUi;
