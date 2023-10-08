import React from 'react';

const ImageEnsure = ({
  src,
  className,
  alt,
  srcOnError = '/images/content/not-found-img.png',
}) => {
  const onError = (e) => {
    e.target.src = srcOnError;
  };

  return <img className={className} src={src ?? "false"} onError={onError} alt={alt} />;
};

export default ImageEnsure;
