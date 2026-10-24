import React from 'react';
import BackToTopButton from '@theme/BackToTopButton';

export default function DocRootLayout({children}) {
  return (
    <div>
      <BackToTopButton />
      <main>{children}</main>
    </div>
  );
}