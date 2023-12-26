import React, { useState } from 'react';
import cn from 'classnames';
import styles from './Entry.module.sass';
import { toast } from 'react-toastify';

import RHFTextInput from '../../../components/RHF/RHFTextInput';
import AsyncButton from '../../../components/AsyncButton';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../../services/api';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignUpSchema } from '../../../utils/ValidateSchema';

const Entry = ({ onConfirm }) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState(
    'An error occurred. The server is currently unavailable.',
  );
  const [loading, setLoading] = useState(false);

  const method = useForm({
    resolver: yupResolver(SignUpSchema),
  });

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
      });
      toast.success('Sign up success');
      navigate('/sign-in', { replace: true });
    } catch (err) {
      console.log(err);
      setIsError(true);
      setMessage('Email already existed');
    }
    setLoading(false);
  };

  return (
    <div className={styles.entry}>
      <div className={styles.body}>
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

            <RHFTextInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              icon="lock"
            />

            <AsyncButton loading={loading} value="Sign Up" type="submit" />
            {isError ? (
              <p className={styles.redLine}>{message}</p>
            ) : (
              <p className={cn(styles.redLine, styles.hidden)}></p>
            )}

            {/*<div className={styles.note}>*/}
            {/*  This site is protected by reCAPTCHA and the Google Privacy Policy.*/}
            {/*</div>*/}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Entry;
