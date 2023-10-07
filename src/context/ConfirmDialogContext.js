import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ConfirmModal } from '../components';

const ConfirmContext = createContext({
  confirm: () => Promise.resolve(),
});

const DEFAULT_OPTIONS = {
  title: 'Are you sure?',
  content: 'Are you sure you want to do this action?',
  contentBtnCancel: 'Cancel',
  contentBtnSubmit: 'Confirm',
  isLoading: false,
  onClose: () => {},
  onCancel: () => {},
  onSubmit: () => {},
};

const ConfirmProvider = ({ children }) => {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);

  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      setOptions(options);
      setResolveReject([resolve, reject]);
    });
  }, []);

  const handleClose = useCallback(() => {
    setResolveReject([]);
  }, []);

  const handleCancel = useCallback(() => {
    if (reject) {
      try {
        reject(new Error('Canceled'));
      } catch (e) {}

      handleClose();
    }
  }, [reject, handleClose]);

  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve('Confirmed');
      handleClose();
    }
  }, [resolve, handleClose]);

  const providerValue = useMemo(
    () => ({
      confirm,
    }),
    [confirm],
  );

  return (
    <>
      <ConfirmContext.Provider value={providerValue}>
        {children}
      </ConfirmContext.Provider>

      <ConfirmModal
        {...{
          ...DEFAULT_OPTIONS,
          ...options,
        }}
        visible={resolveReject.length === 2}
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ConfirmProvider;

export const useConfirm = () => useContext(ConfirmContext);
