import React, { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import cn from 'classnames';
import styles from './ConfirmSaveCampaign.module.sass';

import {
  RHFTextInput,
  RHFTagInput,
  AsyncButton,
  RHFDropdown,
} from '../../../../components';

const ConfirmSaveCampaign = ({ title = '', path }) => {
  return (
    <div className={styles.list}>
      <FormProvider>
        <form>
          <div className={cn(styles.item)}>xxx</div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ConfirmSaveCampaign;
