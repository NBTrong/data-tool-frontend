import CardWithoutPadding from '../CardWithoutPadding';
import { Stack } from 'react-bootstrap';
import { ThreeDots } from 'react-loader-spinner';

import cn from 'classnames';

function ConfirmContent({
  title,
  content,
  contentBtnCancel = 'Cancel',
  contentBtnSubmit = 'Submit',
  isLoading,
  onClose,
  description = '',
  handleSubmit,
}) {
  return (
    <>
      <CardWithoutPadding title={title} classTitle={cn('title-red')}>
        <p>{content}</p>
        {description && (
          <div className={'text-gray mt-2'}>
            <small>{description}</small>
          </div>
        )}
      </CardWithoutPadding>
      <Stack direction="horizontal" gap={3} className="mt-4">
        <p onClick={onClose} className="button-white-grey-border ms-auto">
          {contentBtnCancel}
        </p>
        <button
          className="button"
          onClick={() => {
            handleSubmit();
          }}
        >
          {isLoading ? (
            <ThreeDots width={50} height={32} />
          ) : (
            <span>{contentBtnSubmit}</span>
          )}
        </button>
      </Stack>
    </>
  );
}

export default ConfirmContent;
