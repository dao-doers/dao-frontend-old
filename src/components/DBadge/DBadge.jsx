import React from 'react';

import { Badge as _Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const DBadge = function({
  invisible = false,
  badgeColor,
  badgeContent,
  badgeRadius,
  contentColor,
  maxNumber,
  variant = 'dot',
  overlap,
  anchorOrigin,
  borderColor,
  children}) {
  const CustomBadge = withStyles({
    badge: {
      width: 'max-content',
      height: 'auto',
      backgroundColor: badgeColor,
      color: contentColor || 'var(--white)',
      borderRadius: badgeRadius || '15px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '2px',
      paddingBottom: '0px',
      fontSize: '10px',
      borderStyle: borderColor ? 'solid' : 'none',
      borderColor: borderColor,
    }
  })(_Badge);

  return (
    <>
      <CustomBadge
        invisible={invisible}
        badgeContent={badgeContent}
        max={maxNumber}
        variant={variant}
        overlap={overlap}
        anchorOrigin={anchorOrigin}  
      >
        {children}
      </CustomBadge>
    </>
  );
}

export default DBadge;
