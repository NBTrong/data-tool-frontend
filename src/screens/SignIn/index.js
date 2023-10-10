import React, { useContext, useEffect, useState } from 'react';
import { use100vh } from 'react-div-100vh';
import { Link, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../../context/AuthContext';

import cn from 'classnames';
import styles from './SignIn.module.sass';

import RHFTextInput from '../../components/RHF/RHFTextInput';
import { LogoContainer } from '../../components';
import AsyncButton from '../../components/AsyncButton';

import { SigninSchema } from '../../utils/ValidateSchema';

const SignIn = () => {
  const heightWindow = use100vh();
  const { isAuthenticated, loginWithEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState(
    'An error occurred. The server is currently unavailable.',
  );
  const [loading, setLoading] = useState(false);

  const method = useForm({
    resolver: yupResolver(SigninSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data) => {
    setLoading(true);
    const messageErr = await loginWithEmail(data);
    setLoading(false);
    setIsError(!!messageErr);
    setMessage(messageErr);
  };

  return (
    <div className={styles.login} style={{ minHeight: heightWindow }}>
      <div className={styles.wrapper}>
        <LogoContainer />
        <div className={cn('h2', styles.title)}>Sign in</div>
        <div className={styles.head}></div>
        <FormProvider {...method}>
          <form
            onSubmit={method.handleSubmit(handleSubmit)}
            className={styles.body}
          >
            <RHFTextInput
              name="email"
              type="text"
              placeholder="Email"
              icon="mail"
            />
            <RHFTextInput
              name="password"
              type="password"
              placeholder="Password"
              icon="lock"
            />

            <AsyncButton loading={loading} value="Sign in" type="submit" />

            {isError ? (
              <p className={styles.redLine}>{message}</p>
            ) : (
              <p className={cn(styles.redLine, styles.hidden)}>.</p>
            )}
            {/*<div className={styles.note}>*/}
            {/*  This site is protected by reCAPTCHA and the Google Privacy Policy.*/}
            {/*</div>*/}
            <div className={styles.info}>
              <Link className={styles.link} to="/forgot-password">
                Forgot your password
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default SignIn;
