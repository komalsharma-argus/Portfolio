import React from 'react';
import BookSearch from './BookSearch';

// the navbar already shows the search icon on small screens, so skip the mobile menu copy
export default function NavbarSearchItem({mobile}) {
  return mobile ? null : <BookSearch variant="navbar" />;
}