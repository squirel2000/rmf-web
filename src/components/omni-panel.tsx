import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import { Close as CloseIcon, KeyboardBackspace as BackIcon } from '@material-ui/icons';
import * as RomiCore from '@osrf/romi-js-core-interfaces';
import React from 'react';
import * as CSSUtils from '../util/css-utils';
import { OmniPanelViewProps } from './omni-panel-view';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
  },
}));

interface OmniPanelProps {
  transport?: Readonly<RomiCore.Transport>;
  className?: string;
  classes?: {
    navigation?: string;
    backButton?: string;
    closeButton?: string;
  };
  view: number;
  onBack?: (current: number) => void;
  onClose?: () => void;
  children: React.ReactElement<OmniPanelViewProps>[];
}

export default function OmniPanel(props: OmniPanelProps): JSX.Element {
  const classes = useStyles();

  function handleBackClick() {
    props.onBack && props.onBack(props.view);
  }

  function handleCloseClick() {
    props.onClose && props.onClose();
  }

  return (
    <div className={`${classes.container} ${props.className}`}>
      <ButtonGroup
        className={CSSUtils.className(props.classes, 'navigation')}
        variant="text"
        fullWidth
      >
        <Button
          className={CSSUtils.className(props.classes, 'backButton')}
          size="large"
          onClick={handleBackClick}
        >
          <BackIcon />
        </Button>
        <Button
          className={CSSUtils.className(props.classes, 'closeButton')}
          size="large"
          onClick={handleCloseClick}
        >
          <CloseIcon />
        </Button>
      </ButtonGroup>
      {props.children}
    </div>
  );
}
