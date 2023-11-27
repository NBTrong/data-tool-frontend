import React, { useCallback } from 'react';

import CardWithoutPadding from '../../../components/CardWithoutPadding';
import { getPlatform, isValidHttpUrl } from '../../../utils/helpers';

const ModalFailedRow = ({ failedRows }) => {
  const getRowKeyword = useCallback((text, tab) => {
    if (text.includes('channel-explore')) {
      const platform = getPlatform(text);
      if (isValidHttpUrl(text)) {
        return text;
      } else {
        if (platform === 'tiktok') {
          return 'https://tiktok.com/' + text;
        }
        if (platform === 'youtube') {
          return 'https://tiktok.com/@' + text.replace('@', '');
        }
        if (platform === 'instagram') {
          return 'https://www.instagram.com/' + text;
        }
      }
    }
    return text;
  }, []);

  return (
    <>
      <div>
        <CardWithoutPadding
          title={'Failed rows detail'}
          classTitle={'title-red'}
        />
      </div>
      <div>
        Found {failedRows.length} failed rows{' '}
        {failedRows.length > 500 ? ',Show top 500: ' : ''}
        <div>
          {failedRows.map((row) => {
            return (
              <div className={'limit-1-line word-break'}>
                {isValidHttpUrl(getRowKeyword(row)) ? (
                  <a href={getRowKeyword(row)} target={'_blank'}>
                    {getRowKeyword(row)}
                  </a>
                ) : (
                  <div>getRowKeyword(row)</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ModalFailedRow;
