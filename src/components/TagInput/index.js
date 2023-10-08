import React, { useEffect, useState } from 'react';

import styles from './TagInput.module.sass';

import { Tooltip } from '../../components';
import { WithContext as ReactTags } from 'react-tag-input';
import cn from 'classnames';

function TagInput({
  value,
  title,
  setValue,
  onBlur,
  label,
  placeholder,
  tooltip,
  onUpdate,
  suggestions,
  handleKeyUp,
  handleDeleteTag,
  disabledInput = false,
  visibleLabel = true,
  inputClassName = 'bg-white',
  counter = true,
  ...others
}) {
  const [tags, setTags] = useState([]);

  const handleDelete = (i) => {
    const newTags = tags.filter((tag, index) => index !== i);
    const deleteTag = tags.find((tag, index) => index === i);
    if (deleteTag.text.includes('file: ')) {
      handleDeleteTag();
    }
    setTags(newTags);
    setValue(newTags);
  };

  const handleAddition = (tag) => {
    const newTags = [
      ...tags,
      { id: (tags.length ? tags.length : 0) + 1 + '', text: tag.text },
    ];
    setTags(newTags);
    setValue(newTags);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = [...tags].slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setTags(newTags);
    setValue(newTags);
  };

  const handleTagClick = (index) => {};

  const onTagUpdate = (i, newTag) => {
    const updatedTags = tags.slice();
    setTags([]);
    setValue([]);
    setTimeout(function () {
      updatedTags.splice(i, 1, newTag);
      setTags(updatedTags);
      setValue(updatedTags);
    }, 50);
  };

  useEffect(() => {
    if (value) {
      setTags(value);
    }
  }, [value]);

  useEffect(() => {
    onUpdate(tags);
  }, [tags, onUpdate]);

  return (
    <>
      {visibleLabel && (
        <div className={styles.head}>
          {label && (
            <div className={styles.label}>
              {label}{' '}
              <Tooltip
                className={styles.tooltip}
                title={tooltip}
                icon="info"
                place="right"
              />
            </div>
          )}

          <div className={styles.counter}>
            <span>{tags?.length ?? 0}</span> tags
          </div>
        </div>
      )}
      <div className={cn(styles.tags, others.className)}>
        <ReactTags
          classNames={{
            tagInputField: cn(
              styles.input,
              inputClassName,
              disabledInput && 'disabled',
            ),
          }}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          // onClearAll={onClearAll}
          onTagUpdate={onTagUpdate}
          suggestions={suggestions}
          placeholder={placeholder}
          minQueryLength={2}
          maxLength={256}
          autofocus={false}
          allowDeleteFromEmptyInput={true}
          autocomplete={true}
          readOnly={false}
          allowUnique={true}
          allowDragDrop={true}
          inline={true}
          inputFieldPosition="inline"
          allowAdditionFromPaste={true}
          editable={true}
          clearAll={false}
          tags={tags}
          handleInputChange={handleKeyUp ?? null}
        />
      </div>
    </>
  );
}

export default TagInput;
