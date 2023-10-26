import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import RHFTagInput from '../../../../components/RHF/RHFTagInput';
import { FiSearch } from 'react-icons/fi/index';

const defaultForm = {
  id: '',
  email: '',
  username: '',
  phone: '',
  address: '',
  bio: '',
  color: '',
  avatar: null,
  newPassword: '',
  confirmPassword: '',
  roles: [],
  isKOC: true,
  tiktokHashtags: [],
  instagramHashtags: [],
  tikTokId: '',
  instagramId: '',
  youtubeId: '',
  facebookId: '',
};

const SearchInput = ({ title = '', path, onInputChange, searchValues }) => {
  const method = useForm({
    defaultValues: defaultForm,
  });
  const onSubmit = () => {};
  return (
    <FormProvider {...method}>
      <form onSubmit={onSubmit}>
        <div className={'d-flex align-items-center bg-white rounded-4'}>
          <div className={'ps-3'}>
            <FiSearch className={'fs-5 text-muted'} />
          </div>
          <RHFTagInput
            label=""
            name=""
            defaultValue={searchValues}
            placeholder=" Enter Channel URL"
            visibleLabel={false}
            suggestions={[]}
            onUpdate={onInputChange}
            notRequiredInSuggestions
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default SearchInput;
