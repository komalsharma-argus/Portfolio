import React from 'react';
import PageCountMeasurer from '@site/src/components/Book/PageCountMeasurer';

export default function Root({children}) {
  return (
    <>
      {children}
      <PageCountMeasurer />
    </>
  );
}