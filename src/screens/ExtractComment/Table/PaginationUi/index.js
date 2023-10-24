import React, {useCallback, useState, useMemo} from 'react';
import {Row as Brow, Col} from 'react-bootstrap';

import cn from 'classnames';
import style from "../Table.module.sass";
import {handleLongNumber, timestampToDate} from "../../../../utils/helpers";
import ReactPaginate from "react-paginate";
import styles from "../../../Campaign/Table/Table.module.sass";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {Tooltip} from "../../../../components";
import useQueryString from "../../../../hooks/useQueryString";
import CardComment from "./CardComment";

const perPage = 10;

const PaginationUi = ({array,isLoading}) => {
    const [currentPage,setCurrentPage] = useState(1);
    const totalPage = useMemo(() => {
        return array.length / perPage
    }, [array]);

    const handlePageChange = useCallback(
        ({ selected }) => {
            setCurrentPage(selected + 1);
        },
        [],
    );

    const arr_slice = useMemo(() => {
      return array.slice((currentPage - 1) * perPage, currentPage * perPage)
    },[array,currentPage,perPage])

    return (
        <>
            {arr_slice.map((data,index)=> {
                if (data){
                    return (
                        <CardComment item={data} indexPost={index}/>
                    )
                }
            })}
            { isLoading && (
                <div className={'d-flex justify-content-center mt-4'}>
                    <button className={'btn btn-light text-gray'} disabled={true}>
                    Exploring
                    <div className="spinner-border spinner-border-sm text-secondary ms-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                    </div>
                    </button>
                </div>
                )}
            { (!!array && !!array.length) && <ReactPaginate
                activeClassName={cn(styles.item, styles.active)}
                breakClassName={cn(styles.item)}
                breakLabel={'...'}
                marginPagesDisplayed={2}
                paddingPagesDisplayed={2}
                pageRangeDisplayed={2}
                containerClassName={cn(styles.pagination)}
                nextClassName={cn(styles.item, styles.next)}
                nextLabel={<IoIosArrowForward />}
                onPageChange={handlePageChange}
                pageCount={totalPage}
                forcePage={currentPage - 1 || 0}
                pageClassName={cn(styles.item, 'pagination-page')}
                previousClassName={cn(styles.item, styles.previous)}
                previousLabel={<IoIosArrowBack />}
            />}
        </>
    );
};

export default PaginationUi;
