import React from 'react';
import ImageEnsure from "../../../../../components/ImageEnsure";

const HandleImage = ({ src, className, style, srcOnError, alt }) => {

    return (
        <ImageEnsure style={style} className={className} src={src ?? "false"} srcOnError={srcOnError} alt={alt} />
    );
};

export default HandleImage;
