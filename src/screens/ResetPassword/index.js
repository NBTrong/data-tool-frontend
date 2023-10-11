import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import cn from 'classnames';
import styles from '../SignIn/SignIn.module.sass';
import { use100vh } from 'react-div-100vh';

import useParameters from '../../hooks/useParameters';

import { sleep } from '../../utils/helpers';

import {
  LogoContainer,
  Modal,
  RHFTextInput,
  Image,
  AsyncButton,
} from '../../components';

import { resetPassword } from '../../services/api';

import { ResetPasswordSchema } from '../../utils/ValidateSchema';

const ResetPassword = () => {
  const heightWindow = use100vh();
  const parameters = useParameters();

  const token = parameters.get('token');

  const [notif, setNotif] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const method = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const { handleSubmit } = method;

  const onSubmit = async (data) => {
    if (data.password !== data.rePassword) {
      setNotif(1);
      return;
    }
    setLoading(true);
    try {
      await sleep(500);
      await resetPassword({ password: data.password }, token);
      setShowModal(true);
    } catch (error) {
      setNotif(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login} style={{ minHeight: heightWindow }}>
      <div className={styles.wrapper}>
        <Modal
          outerClassName=""
          visible={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className={styles.content}>
            <Image
              className={styles.image}
              src="images/Tick.png"
              srcSet="images/Tick.png"
            />
            <p className={styles.title1}>Password Changed Successfully!</p>
            <p className={styles.title2}>
              Please use your new password to log in
            </p>
            <button className={styles.button}>
              <Link className="button" to="/sign-in">
                Sign in
              </Link>
            </button>
          </div>
        </Modal>
        <LogoContainer />
        <div className={cn('h2', styles.title)}>Reset Password</div>
        <div className={styles.head}></div>
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.body}>
            <RHFTextInput
              name="password"
              type="password"
              placeholder="Enter new Password"
              icon="lock"
            />
            <RHFTextInput
              name="rePassword"
              type="password"
              placeholder="Re-enter new Password"
              icon="lock"
            />
            <AsyncButton
              loading={loading}
              type="submit"
              value={'Confirm'}
              className={cn('button', styles.button)}
            />
            {notif ? (
              <p className={styles.redLine}>Passwords do not match</p>
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

export default ResetPassword;
