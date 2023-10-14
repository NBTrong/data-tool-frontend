import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import cn from 'classnames';
import styles from '../SignIn/SignIn.module.sass';
import { use100vh } from 'react-div-100vh';

import {
  LogoContainer,
  Modal,
  RHFTextInput,
  AsyncButton,
} from '../../components';

import { sleep } from '../../utils/helpers';
import { ForgotPasswordSchema } from '../../utils/ValidateSchema';

import { forgotPassword } from '../../services/api';

const ForgotPassword = () => {
  const heightWindow = use100vh();

  const [notif, setNotif] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const method = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const { handleSubmit } = method;

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await sleep(500);
      await forgotPassword(email);
      setShowModal(true);
    } catch {
      setNotif(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login} style={{ minHeight: heightWindow }}>
      <Modal
        outerClassName=""
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className={styles.rpModal}>
          <p>Please use the link in your mail</p>
          <p> to reset password</p>
        </div>
      </Modal>
      <div className={styles.wrapper}>
        <LogoContainer />
        <div className={cn('h2', styles.title)}>Forgot Password</div>
        <div className={styles.head}></div>
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.body}>
            <RHFTextInput
              name="email"
              type="text"
              placeholder="Your email"
              icon="mail"
            />
            <AsyncButton
              loading={loading}
              type="submit"
              value={'Send reset password URL'}
              className={cn('button', styles.button)}
            />
            {notif ? (
              <p className={styles.redLine}>
                Your account does not exist in the system. Please re-enter
              </p>
            ) : (
              <p className={cn(styles.redLine, styles.hidden)}>.</p>
            )}
            <div className={styles.note}>
              This site is protected by reCAPTCHA and the Google Privacy Policy.
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ForgotPassword;
