import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';

import Flag from 'components/Flag/Flag';
import Alert from '@material-ui/lab/Alert';

import 'styles/Dapp.css';

/**
 * @summary renders a post in the timeline
 */
export default class Period extends Component {
  static propTypes = {
    now: PropTypes.number,
    votingPeriodBegins: PropTypes.string,
    votingPeriodEnds: PropTypes.string,
    gracePeriodEnds: PropTypes.string,
    url: PropTypes.string,
    status: PropTypes.string,
  };

  getStyle() {
    if (this.props.now > this.props.gracePeriodEnds) {
      return `warning period period-${this.props.status.toLowerCase()}`;
    } else if (this.props.now > this.props.votingPeriodEnds) {
      return 'warning period period-grace';
    } else if (this.props.now > this.props.votingPeriodBegins) {
      return 'warning period period-voting';
    }
    return 'warning period period-queue';
  }

  getLabel() {
    if (this.props.now > this.props.gracePeriodEnds) {
      return i18n.t(`moloch-period-${this.props.status.toLowerCase()}`);
    } else if (this.props.now > this.props.votingPeriodEnds) {
      return i18n.t('moloch-period-grace');
    } else if (this.props.now > this.props.votingPeriodBegins) {
      return i18n.t('moloch-period-voting');
    }
    return i18n.t('moloch-period-queue');
  }

  render() {
    return (
      <Alert
          className={this.getStyle()}
          severity="info"
          variant="standard"
          url={this.props.url}
          tooltip={i18n.t('moloch-open-proposal')}
        >
          {this.getLabel()}
        </Alert>
    );
  }
}
