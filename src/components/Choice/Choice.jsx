import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";

import { defaults } from 'lib/const';
import {
  noWallet,
  alreadyVoted,
  pollClosed,
  notSynced,
  notMember,
  noAddress,
  walletError,
} from 'components/Choice/messages';
import { abiLibrary } from 'lib/abi';
import { canVote, hasVoted, execute } from './utils';

import logo from 'images/vote.svg';

import { getDescription } from 'components/Post/Post';
import i18n from 'i18n';
import 'styles/Dapp.css';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import ChartDataLabels from "chartjs-plugin-datalabels";

import { Button } from '@material-ui/core';
Chart.register(
  ArcElement, 
  ChartDataLabels,
);

/**
 * @summary displays the contents of a poll
 */

export default class Choice extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    accountAddress: PropTypes.string,
    percentage: PropTypes.string,
    labelYes: PropTypes.string,
    labelNo: PropTypes.string,
    voteValue: PropTypes.number,
    votingPeriodBegins: PropTypes.string,
    votingPeriodEnds: PropTypes.string,
    description: PropTypes.string,
    proposalIndex: PropTypes.string,
    publicAddress: PropTypes.string,
    daoName: PropTypes.string,
    now: PropTypes.number,
    abi: PropTypes.string,
    data: PropTypes.any,
    totalVotes: PropTypes.any,
  };

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  getlabelClass() {
    if (Number(this.props.percentage) < 10) {
      return 'poll-score-percentage poll-score-small';
    }
    return 'poll-score-percentage';
  }

  getBarStyle() {
    if (this.props.label === i18n.t('no')) {
      return 'poll-score-bar-fill poll-score-bar-fill-negative';
    }
    return 'poll-score-bar-fill';
  }

  pollOpen() {
    const now = parseInt(this.props.now, 10);
    console.log({
      now,
      begins: this.props.votingPeriodBegins,
      ends: this.props.votingPeriodEnds,
    });
    return this.props.votingPeriodBegins < now && this.props.votingPeriodEnds > now;
  }

  vote = async () => {
    // blockchain sync
    if (!this.props.now || this.props.now === 0) {
      return notSynced();
    }

    // no web3 wallet
    if (!window.web3 || !window.web3.currentProvider) {
      return noWallet();
    }

    // no address
    if (this.props.accountAddress === '0x0') {
      return noAddress();
    }

    // dao membership
    if (!(await canVote(this.props.accountAddress, this.props.publicAddress))) {
      return notMember();
    }

    // already voted
    if (!(await hasVoted(this.props.accountAddress, this.props.proposalIndex, this.props.publicAddress))) {
      return alreadyVoted();
    }

    // poll date
    if (!this.pollOpen()) {
      return pollClosed();
    }

    // vote
    let message;
    switch (this.props.voteValue) {
      case defaults.YES:
        message = i18n.t('dao-confirm-tally', {
          voteValue: i18n.t('yes'),
          proposalName: getDescription(this.props.description).title,
        });
        break;
      case defaults.NO:
        message = i18n.t('dao-confirm-tally', {
          voteValue: i18n.t('no'),
          proposalName: getDescription(this.props.description).title,
        });
        break;
      default:
        message = i18n.t('dao-default-tally', { proposalName: getDescription(this.props.description).title });
    }

    window.modal = {
      icon: logo,
      title: i18n.t('place-vote'),
      message,
      cancel: i18n.t('close'),
      displayBallot: true,
      mode: 'AWAIT',
    };
    window.showModal.value = true;
    return await execute(
      this.props.proposalIndex,
      this.props.voteValue,
      this.props.accountAddress,
      this.props.publicAddress,
    );
  };
  render(
    
  ) {
    const style = {
      borderRadius: 20,
      height: 30,
      width: 100,
      color: 'var(--background-color)',
      fontWeight: 'bold'
    };

    let sumArray = this.props.data.reduce((a, b) => a + b, 0)
    let totalVotes = this.props.totalVotes

    return (
      <>
        <Grid container className="poll-choice" justifyContent='center'>
          <Grid item className='pool-choice-button' >
            <Button className="pool-choice-button-yes" style={style}  onClick={this.vote} endIcon={this.props.data[0]}>{i18n.t('yes')}</Button>
            <div className='pool-choice-space-between' />
            <Button style={style} className="pool-choice-button-no" onClick={this.vote} endIcon={this.props.data[1]}>{i18n.t('no')}</Button>
          </Grid>
          <Grid item className='pool-choice-Doughnut'>
            <Doughnut
              data={{
                labels: ['yes', 'no'],
                datasets: [
                  {
                    label: ['yes', 'no'],
                    data: sumArray === '000' ? [1,1] : this.props.data,
                    backgroundColor: [
                      "#01c190",
                      "#ff3d67",
                    ],
                    cutout: '75%',
                    hoverOffset: 3,
                    borderColor: '#fff',
                    hoverBorderColor: ['#e8f4fd'],
                  },
                ],
              }}
              plugins= {
                [{
                id: 'text',
                beforeDraw: function(chart, a, b) {
                  var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;
                  ctx.restore();
                  var fontSize = (height / 200).toFixed(2);
                  ctx.font = fontSize + "em sans-serif";
                  ctx.textBaseline = "middle";

                  var text = sumArray === '000' ? 'VOTE NOW' : `VOTES: ${totalVotes}`,
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2;

                  ctx.fillText(text, textX, textY);
                  ctx.save();
                }
              }]
            }
              options={{
                // onClick: this.vote,
                responsive:true,
                maintainAspectRatio: false,
                animation: {
                  animateScale: true,
                    duration: 1000
                },
                plugins: {
                  ChartDataLabels,
                  datalabels: {
                    // backgroundColor: function(context) {
                    //   return context.dataset.backgroundColor;
                    // },
                    formatter: (value, ctx) => {
                      let sum = 0;
                      let dataArr = ctx.chart.data.datasets[0].data;
                      dataArr.map(data => {
                          sum += data;
                      });
                      let percentage = (value*100 / sum).toFixed(0)+"%";
                      return ctx.active ? percentage : null;
                  },
                    offset: 8,
                    align: 'end',
                    anchor: 'end',
                    // borderColor: 'white',
                    borderRadius: 50,
                    borderWidth: 2,
                    color: 'black',
                    font: {
                      weight: 'bold',
                      size: 10
                    },
                    padding: 5,
                  },
                }
            }}
        />
        </Grid>
      </Grid>
      </>
    );
  }
}
