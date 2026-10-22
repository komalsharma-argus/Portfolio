import React from 'react';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import pageTurn from './pageTurn';

// a normal link that turns the page before showing the destination
export default function TurnLink({to, dir = 1, onClick, ...props}) {
  const history = useHistory();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (props.target === '_blank') return;
    e.preventDefault();
    pageTurn(() => history.push(to), dir);
  };

  return <Link to={to} onClick={handleClick} {...props} />;
}