// ConfirmContent.js

import React, {useState, useCallback, useContext, useEffect} from 'react';
import SubmitModal from '../SubmitModal';
import { Modal } from '../index';
import styles from './ConfirmEnqueue.module.sass';
import cn from "classnames";
import {GlobalShareContext} from "../../App";

function ConfirmContent({
                            isShowConfirmQueue,
                            setIsShowConfirmQueue,
                            handleCancelQueue,
                            handleConfirmQueue,
                            isLoading
                        }) {
    const [isSubmit, setIsSubmit] = useState(false);
    const [showBadge, setShowBadge] = useState(false);
    const {globalShare,setGlobalShare} = useContext(GlobalShareContext)

    // Function to handle the badge animation
    const handleBadgeAnimation = useCallback(() => {
        setShowBadge(true);
        setTimeout(() => {
            setShowBadge(false);
        }, 2000); // Change this value to match the animation-duration from styles.scss
    }, []);

    const handleSubmit = async () => {
        await handleConfirmQueue();
        setTimeout(()=>{
            setIsSubmit(true)
        },100)
    }

    useEffect(()=>{
        if (isSubmit && !isLoading){
            setGlobalShare((prev) => {
                const newShare = { ...prev }; // Tạo một bản sao của đối tượng prev để không làm thay đổi trực tiếp đối tượng gốc
                newShare.countInputFile = "plush"; // Thêm thuộc tính countInputFile và đặt giá trị là "plush"
                return newShare; // Trả về đối tượng mới đã được cập nhật
            });
            setIsSubmit(false)
        }
    },[isSubmit,isLoading])

    return (
        <>
            <Modal visible={isShowConfirmQueue} onClose={() => setIsShowConfirmQueue(false)}>
                <SubmitModal
                    title={'Enqueue file'}
                    contentBtnSubmit={'Put in queue\n'}
                    contentBtnCancel={'Use preview'}
                    isLoading={isLoading}
                    onClose={async () => {
                        await handleCancelQueue();
                    }}
                    content={`
                  <b>Do you want to put this file in the queue (Increase speed, increase accuracy and file will be saved but not preview directly).</b>
                  <br>
                  <div class="lh-sm mt-2"><small>* Note: Using the preview should only return the number of results from 10k-20k posts depending on your computer.
                  Should use Queue if keywords contains a large number of posts</small></div>`}
                    handleSubmit={async ()=> {
                        await handleSubmit()
                    }}
                />
                {/* Render the badge conditionally based on showBadge state */}
                {/*{showBadge && <div className={`${styles.badge} ${styles.animate_badge}`}>Queue</div>}*/}
            </Modal>
        </>
    );
}

export default ConfirmContent;
