import React from 'react';
import {Tooltip} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';

export default function TooltipWithChildren({
  title,
  children = <HelpIcon />,
  color = 'var(--background-color)',
  placement,
  backgroundColor = 'var(--main-menu-color)',
}) {
  const styles = makeStyles({
    tooltip: {
      backgroundColor,
      color,
      padding: '4px 18px',
      fontSize: '1.5rem',
      fontWeight: '500',
      minHeight: '13px',
      width: '700px',
      borderRadius: '8px',
    },
    arrow: {
      color,
      fontSize: '44px',
    },
  });

  return (
    <Tooltip
      classes={{ tooltip: styles().tooltip, arrow: styles().arrow }}
      title={title}
      style={{ marginTop: '-5px', paddingLeft: '5px' }}
      placement={placement}
      PopperProps={{
        disablePortal: true,
        popperOptions: {
          positionFixed: true,
          modifiers: {
            preventOverflow: {
              enabled: true,
              boundariesElement: 'window',
            },
            offset: {
              enabled: true,
              offset: '100px, 0',
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
