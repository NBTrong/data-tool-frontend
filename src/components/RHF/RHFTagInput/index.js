import { Controller, useFormContext } from 'react-hook-form';

import cn from 'classnames';
import styles from '../RHFTextInput/RHFTextInput.module.sass';

import TagInput from '../../TagInput';

function RHFTagInput({
  name,
  label,
  placeholder,
  onUpdate,
  defaultValue,
  visibleLabel = true,
  handleKeyUp,
  disabledInput = false,
  suggestions = [],
  handleDeleteTag,
  inputClassName,
  ...others
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => {
        return (
          <>
            <TagInput
              value={defaultValue}
              setValue={onChange}
              onBlur={onBlur}
              label={label}
              onUpdate={onUpdate}
              placeholder={placeholder}
              suggestions={suggestions}
              visibleLabel={visibleLabel}
              handleKeyUp={handleKeyUp}
              inputClassName={inputClassName}
              handleDeleteTag={handleDeleteTag}
              disabledInput={disabledInput}
              {...others}
            />
            {error ? (
              <p className={styles.redLine}>{error.message}</p>
            ) : (
              <p className={cn(styles.hidden, styles.redLine)}>.</p>
            )}
          </>
        );
      }}
    />
  );
}

export default RHFTagInput;
