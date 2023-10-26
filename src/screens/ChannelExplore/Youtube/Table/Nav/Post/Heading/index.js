import React, { useMemo } from 'react';

import cn from 'classnames';
import styles from '../../../Table.module.sass';
import { Col } from 'react-bootstrap';
import TableHeadingSort from '../../../../../../../components/TableHeadingSort';

const Heading = ({ handleSort, displayIcon }) => {
  const summaryField = useMemo(() => {
    return [
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
        text: 'Uploaded',
      },
    ];
  }, []);

  return (
    <>
      <Col xs={4} className={cn(styles.col)}>
        Post
      </Col>
      <Col xs={2} className={styles.col}>
        KOC
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
