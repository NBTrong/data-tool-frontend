import CardWithoutPadding from '../CardWithoutPadding';
import { Stack } from 'react-bootstrap';
import { ThreeDots } from 'react-loader-spinner';

import cn from 'classnames';

function ConfirmContent({
  title,
  content,
  contentBtnCancel = 'Back',
  contentBtnSubmit = 'Submit',
  isLoading,
  onClose,
  handleSubmit,
}) {
  return (
    <>
      <CardWithoutPadding title={title} classTitle={cn('title-red')}>
        <p
          className={'text-muted'}
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
      </CardWithoutPadding>
      <Stack direction="horizontal" gap={3} className="mt-4">
        <div className={'d-flex justify-content-between w-100'}>
          <p onClick={onClose} className="button-white-grey-border">
            {contentBtnCancel}
          </p>
          <button className="button opacity-75" onClick={handleSubmit}>
            {isLoading ? (
              <ThreeDots width={50} height={32} />
            ) : (
              <span>{contentBtnSubmit}</span>
            )}
          </button>
        </div>
      </Stack>
    </>
  );
}

export default ConfirmContent;
