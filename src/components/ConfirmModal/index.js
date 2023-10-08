import { Stack } from 'react-bootstrap';
import { ThreeDots } from 'react-loader-spinner';

import CardWithoutPadding from '../CardWithoutPadding';
import Modal from '../Modal';

function ConfirmContent({
  visible,
  title,
  content,
  contentBtnCancel = 'Cancel',
  contentBtnSubmit = 'Submit',
  isLoading,
  onClose,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <CardWithoutPadding title={title} classTitle="title-red">
        <p className="text-muted">{content}</p>
      </CardWithoutPadding>

      <Stack direction="horizontal" gap={2} className="mt-4">
        <button className="button-white-grey-border ms-auto" onClick={onCancel}>
          {contentBtnCancel}
        </button>

        <button className="button" onClick={onConfirm}>
          {isLoading ? (
            <ThreeDots width={50} height={32} />
          ) : (
            <span>{contentBtnSubmit}</span>
          )}
        </button>
      </Stack>
    </Modal>
  );
}

export default ConfirmContent;
