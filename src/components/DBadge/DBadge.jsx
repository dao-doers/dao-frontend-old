import React from 'react';

import { Badge as _Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

var DBadge = function({
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
      backgroundColor: badgeColor,
      color: contentColor || 'var(--white)',
      borderRadius: badgeRadius || '15px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '10px',
      paddingBottom: '10px',
      borderStyle: borderColor ? 'solid' : 'none',
      borderColor: borderColor,
      transform: "scale(0.8) translate(120%, -5%)",
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
