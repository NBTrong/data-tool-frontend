import React, { useCallback, useState, useMemo, useContext } from 'react';
import { Row as Brow, Col } from 'react-bootstrap';

import cn from 'classnames';
import style from "../Table.module.sass";
import { handleLongNumber, timestampToDate } from "../../../../utils/helpers";
import ReactPaginate from "react-paginate";
import styles from "../../../Campaign/Table/Table.module.sass";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import HandleImage from "./HandleImage";
import { Tooltip } from "../../../../components";

const perPage = 10;

const PaginationUi = ({ array, isLoading, activeDetectVoice }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPage = useMemo(() => {
        return array.length / perPage
    }, [array]);

    const onErrorImage = useCallback((platform) => {
        if (platform === 'instagram') {
            return '/images/content/instagram.png';
        }
        if (platform === 'tiktok') {
            return '/images/content/tiktok.gif';
        }
        if (platform === 'youtube') {
            return '/images/content/youtube.png';
        }
        return '/images/content/not-found-img.png';
    }, []);

    const handlePageChange = useCallback(
        ({ selected }) => {
            setCurrentPage(selected + 1);
        },
        [],
    );

    const arr_slice = useMemo(() => {
        return array.slice((currentPage - 1) * perPage, currentPage * perPage)
    }, [array, currentPage, perPage])

    return (
        <>
            {arr_slice.map((data) => {
                if (!data.failed) {
                    return (
                        <Brow className={'py-2 my-1 border-bottom flex-nowrap'}>
                            <Col
                                className={cn(
                                    'd-flex justify-content-start align-items-center pe-0',
                                    style.col_image,
                                )}
                            >
                                <HandleImage
                                    className={'w-100 rounded-2'}
                                    style={{ height: 'auto' }}
                                    src={data?.thumb_url ?? "false"}
                                    platform={data?.platform}
                                    srcOnError={onErrorImage(data?.platform)}
                                    alt={(data?.title)?.slice(0, 25)}
                                />
                            </Col>
                            <Col
                                className={cn(
                                    'ps-4 col-2 d-flex align-items-center',
                                    style.col_min_width_md,
                                )}
                            >
                                <div style={{ maxWidth: '100%' }}>
                                    <a href={data?.url} target={'_blank'} rel={'noopener'}>
                                        <p style={{ wordWrap: 'break-word', maxWidth: '90%' }}>
                                            {data?.url}
                                        </p>
                                    </a>
                                </div>
                            </Col>
                            <Col style={{ lineHeight: "1.7" }}
                                className={cn(
                                    'd-flex align-items-center col-2 text-secondary',
                                    style.col_min_width_md,
                                )}
                            >
                                <Tooltip title={data?.title}>
                                    <div className={'limit-4-line'}>{data?.title}</div>
                                </Tooltip>
                            </Col>
                            <Col
                                className={cn(
                                    'd-flex justify-content-start align-items-center col fw-normal text-secondary text-capitalize',
                                    style.col_min_width,
                                )}
                            >
                                {data?.platform}
                            </Col>
                            <Col
                                className={cn(
                                    'd-flex justify-content-start align-items-center col',
                                    style.col_min_width,
                                )}
                                style={{ minWidth: '90px' }}
                            >
                                <span className={'status-default fw-bold'}>
                                    {handleLongNumber(data?.statistics?.view_count)}
                                </span>
                            </Col>
                            <Col
                                className={cn('d-flex justify-content-start align-items-center col')}
                                style={{ minWidth: '90px' }}
                            >
                                <span className={'status-default fw-bold'}>
                                    {handleLongNumber(data?.statistics?.like_count)}
                                </span>
                            </Col>
                            <Col
                                className={cn('d-flex justify-content-start align-items-center col')}
                                style={{ minWidth: '90px' }}
                            >
                                <span className={cn('status-default fw-bold')}>
                                    {handleLongNumber(
                                        data?.statistics?.share_count
                                            ? data?.statistics?.share_count
                                            : '0',
                                    )}
                                </span>
                            </Col>
                            <Col
                                className={'d-flex justify-content-start align-items-center col'}
                                style={{ minWidth: '90px' }}
                            >
                                <span className={cn('status-default fw-bold')}>
                                    {handleLongNumber(data?.statistics?.comment_count)}
                                </span>
                            </Col>
                            <Col
                                className={'d-flex justify-content-start align-items-center col'}
                                style={{ minWidth: '90px' }}
                            >
                                <span className={cn('status-default fw-bold')}>
                                    {handleLongNumber(
                                        data?.statistics?.save_count ? data?.statistics?.save_count : '0',
                                    )}
                                </span>
                            </Col>
                            <Col
                                className={cn(
                                    'd-flex justify-content-start align-items-center col text-secondary',
                                    style.col_min_width,
                                )}
                            >
                                {timestampToDate(data?.created_at)}
                            </Col>
                        </Brow>
                    )
                } else {
                    return (
                        <Brow className={'py-2 my-1 border-bottom flex-nowrap'}>
                            <Col
                                className={cn(
                                    'd-flex justify-content-start align-items-center pe-0',
                                    style.col_image,
                                )}
                            >
                                <HandleImage
                                    className={'w-100 rounded-2'}
                                    style={{ height: 'auto' }}
                                    src={data?.thumb_url ?? "false"}
                                    platform={data?.platform}
                                    srcOnError={onErrorImage(data?.platform)}
                                    alt={(data?.title)?.slice(0, 25)}
                                />
                            </Col>
                            <Col
                                className={cn(
                                    'ps-4 col-2 d-flex align-items-center',
                                    style.col_min_width_md,
                                )}
                            >
                                <div style={{ maxWidth: '100%' }}>
                                    <a href={data?.url} target={'_blank'} rel={'noopener'}>
                                        <p style={{ wordWrap: 'break-word', maxWidth: '90%' }}>
                                            {data?.url}
                                        </p>
                                    </a>
                                </div>
                            </Col>
                            <Col style={{ lineHeight: "1.7" }}
                                className={cn(
                                    'col-2 text-secondary limit-4-line text-danger',
                                    style.col_min_width_md,
                                )}
                            >
                                {data?.title}
                            </Col>
                        </Brow>
                    )
                }
            })}
            {isLoading && (
                <div className={'d-flex justify-content-center mt-4'}>
                    <button className={'btn btn-light text-gray'} disabled={true}>
                        Exploring
                        <div className="spinner-border spinner-border-sm text-secondary ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>
            )}
            {(!!array && !!array.length) && <ReactPaginate
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
            />}
        </>
    );
};

export default PaginationUi;
