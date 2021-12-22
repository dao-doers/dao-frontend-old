import React from 'react';

import { Badge as _Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

/**
 * Badge component. It has six basic types
 * `primary`, `accent`, `warning`, `error`, `success` and `info`.
 * You can customize its shape and content through props.
 */
var DBadge = function({
  severity,
  invisible = false,
  badgeColor,
  badgeContent,
  badgeRadius,
  contentColor,
  maxNumber,
  variant = 'dot',
  overlap,
  anchorOrigin,
  children}) {
  const CustomBadge = withStyles({
    anchorOriginTopRightRectangle: {
      transform: "translate(120%, -5%)"
  },
    badge: {
      backgroundColor: (
        severity === 'primary' && !badgeColor && 'var(--primary)',
        severity === 'accent' && !badgeColor && 'var(--accent)',
        severity === 'warning' && !badgeColor && 'var(--warn)',
        severity === 'error' && !badgeColor && 'var(--negative-signal-color)',
        severity === 'success' && !badgeColor && 'var(--positive-signal-color)',
        severity === 'info' && !badgeColor && 'var(--info)',
        !severity && badgeColor && badgeColor,
        severity && badgeColor && badgeColor,
        !severity && !badgeColor && 'var(--default)'),
      color: 
        // eslint-disable-next-line no-nested-ternary
        !contentColor
          ? severity === 'warning'
            ? 'var(--default-darker)'
            : `var(--white)`
          : contentColor,

      borderRadius: badgeRadius || '15px'
    }
  })(_Badge);

  return (
    <>
      <CustomBadge
        severity={severity}
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
