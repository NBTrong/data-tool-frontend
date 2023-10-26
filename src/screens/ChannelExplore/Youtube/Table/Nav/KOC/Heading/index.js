import React, { useMemo } from 'react';

import cn from 'classnames';
import styles from '../../../Table.module.sass';
import { Col } from 'react-bootstrap';
import TableHeadingSort from '../../../../../../../components/TableHeadingSort';

const Heading = ({ handleSort, displayIcon }) => {
  const summaryField = useMemo(() => {
    return [
      {
        field: 'posts',
        text: 'Posts',
      },
      {
        field: 'views',
        text: 'Views',
      },
      {
        field: 'likes',
        text: 'Likes',
      },
      {
        field: 'comments',
        text: 'Comments',
      },
      {
        field: 'uploaded',
        text: 'Latest Related Content',
      },
    ];
  }, []);
  return (
    <>
      <Col xs={2} className={cn(styles.col)}>
        Author
      </Col>
      <Col xs={2} className={styles.col}>
        Related Contents
      </Col>
      <TableHeadingSort
        summaryField={summaryField}
        handleSort={handleSort}
        displayIcon={displayIcon}
      />
    </>
  );
};

export default Heading;
