import CardWithoutPadding from '../CardWithoutPadding';
import { Stack } from 'react-bootstrap';
import { ThreeDots } from 'react-loader-spinner';

import cn from 'classnames';
import { RHFTextInput } from '../index';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const defaultForm = {
  name: '',
};

function ConfirmContent({
  title,
  content,
  inputLabel,
  inputPlaceholder,
  inputName,
  contentBtnCancel = 'Cancel',
  contentBtnSubmit = 'Submit',
  isLoading,
  onClose,
  handleSubmit,
  validate,
}) {
  const method = useForm({
    resolver: yupResolver(validate),
    defaultValues: defaultForm,
  });
  return (
    <>
      <form onSubmit={method.handleSubmit(handleSubmit)}>
        <CardWithoutPadding title={title} classTitle={cn('title-red')}>
          <p
            className={'text-muted'}
            dangerouslySetInnerHTML={{ __html: content }}
          ></p>
        </CardWithoutPadding>
        <div className={'mt-4'}>
          <FormProvider {...method}>
            <RHFTextInput
              name={inputName ?? inputLabel}
              label={inputLabel}
              type="text"
              placeholder={inputPlaceholder}
              tooltip={inputLabel + ' is required'}
            />
          </FormProvider>
        </div>
        <Stack direction="horizontal" gap={2} className="mt-2">
          <p onClick={onClose} className="button-white-grey-border ms-auto">
            {contentBtnCancel}
          </p>
          <button className="button" type={'submit'}>
            {isLoading ? (
              <ThreeDots width={50} height={32} />
            ) : (
              <span>{contentBtnSubmit}</span>
            )}
          </button>
        </Stack>
      </form>
    </>
  );
}

export default ConfirmContent;
