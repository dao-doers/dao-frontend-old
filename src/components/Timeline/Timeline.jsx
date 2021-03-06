/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from 'react';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider, useLazyQuery } from '@apollo/react-hooks';

import PropTypes from 'prop-types';

import Account from 'components/Account/Account';
import Post, { getDescription } from 'components/Post/Post';
import Stamp from 'components/Stamp/Stamp';
import Parameter from 'components/Parameter/Parameter';
import Token, { getBalanceLabel } from 'components/Token/Token';
import Countdown from 'components/Countdown/Countdown';
import Poll from 'components/Poll/Poll';
import Choice from 'components/Choice/Choice';
import Period from 'components/Period/Period';
import Contract from 'components/Contract/Contract';
import Placeholder from 'components/Timeline/Placeholder';
import Survey from 'components/Poll/Survey';
import Social from 'components/Social/Social';
import Toggle from 'components/Toggle/Toggle';
import Search from 'components/Search/Search';
import Paginator from 'components/Paginator/Paginator';
import Expand from 'components/Expand/Expand';

import { ConnectedAccount } from 'components/Dapp/Dapp';
import { getQuery } from 'components/Timeline/queries';
import { config } from 'config';
import { defaults, view as routerView, period as routerPeriod } from 'lib/const';
import { uniqBy, orderBy as _orderBy } from 'lodash';

import i18n from 'i18n';
import parser from 'html-react-parser';

import notFound from 'images/not-found.svg';
import ethereum from 'images/ethereum.svg';
import ethereumActive from 'images/ethereum-active.svg';
import hand from 'images/hand.svg';
import handActive from 'images/hand-active.svg';
import thumbUp from 'images/approved.svg';
import thumbUpActive from 'images/approved-active.svg';
import thumbDown from 'images/rejected.svg';
import thumbDownActive from 'images/rejected-active.svg';

import 'styles/Dapp.css';
import { sponsorProposal } from 'components/ProposalLauncher/utils';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(
  ArcElement, 
  ChartDataLabels,
);
import Alert from '@material-ui/lab/Alert';
import { Grid } from '@material-ui/core';

/**
 * @summary retrieves the corresponding query for the timeline.
 * @param {string} field if required for a specific query
 */
const composeQuery = (view, period) => {
  switch (view) {
    case routerView.HOME:
      return getQuery('GET_PROPOSALS');
    case routerView.DAO:
      return getQuery('GET_PROPOSALS_DAO', period);
    case routerView.PROPOSAL:
      return getQuery('GET_PROPOSAL_ID');
    case routerView.PERIOD:
      switch (period) {
        case routerPeriod.QUEUE:
          return getQuery('GET_PROPOSALS_PERIOD_QUEUE');
        case routerPeriod.VOTING:
          return getQuery('GET_PROPOSALS_PERIOD_VOTING');
        case routerPeriod.GRACE:
          return getQuery('GET_PROPOSALS_PERIOD_GRACE');
        case routerPeriod.READY:
          return getQuery('GET_PROPOSALS_PERIOD_READY');
        case routerPeriod.REJECTED:
          return getQuery('GET_PROPOSALS_PERIOD_REJECTED');
        case routerPeriod.APPROVED:
          return getQuery('GET_PROPOSALS_PERIOD_APPROVED');
        default:
      }
      break;
    case routerView.TOKEN:
      return getQuery('GET_PROPOSALS_TOKEN', period);
    case routerView.DATE:
      return getQuery('GET_PROPOSALS_DATE', period);
    case routerView.ADDRESS:
      return getQuery('GET_PROPOSALS_ADDRESS', period);
    case routerView.SEARCH:
      return getQuery('GET_PROPOSALS_SEARCH');
    default:
  }
};

const client = new ApolloClient({
  uri: config.graph.moloch,
  cache: new InMemoryCache(),
});

const _getPercentage = (percentageAmount, remainder) => {
  return (percentageAmount * 100) / (percentageAmount + remainder), 10;
};

/**
 * @summary display the value of this proposal in label of expander button
 * @param {object} proposal obtained from query
 * @return {string} with label
 */
const _getProposalValue = proposal => {
  let value;
  let symbol;
  let hasValue = false;
  if (proposal.paymentRequested && proposal.paymentRequested !== '0') {
    value = getBalanceLabel(proposal.paymentRequested, proposal.paymentTokenDecimals);
    symbol = proposal.paymentTokenSymbol;
    hasValue = true;
  } else if (proposal.tributeOffered && proposal.tributeOffered !== '0') {
    value = getBalanceLabel(proposal.tributeOffered, proposal.tributeTokenDecimals);
    symbol = proposal.tributeTokenSymbol;
    hasValue = true;
  } else if (proposal.sharesRequested && proposal.sharesRequested !== '0') {
    value = getBalanceLabel(proposal.sharesRequested, 0);
    symbol = i18n.t('shares');
    hasValue = true;
  }
  if (hasValue) {
    return i18n.t('proposal-value', { value, symbol });
  }
  return i18n.t('see-proposal-details');
};

const Feed = function (props) {
  const { address, first, skip, orderBy, orderDirection, proposalId, param } = props;
  const now = Math.floor(new Date().getTime() / 1000);

  let { dateBegin, dateEnd } = now.toString();
  if (props.view === routerView.DATE) {
    dateBegin = Math.floor(new Date(param).getTime() / 1000).toString();
    dateEnd = Math.floor(new Date(param).getTime() / 1000 + 86400).toString();
  }

  const [getFeed, { data, loading, error }] = useLazyQuery(composeQuery(props.view, props.period), {
    variables: { address, first, skip, orderBy, orderDirection, now, proposalId, param, dateBegin, dateEnd },
  });

  let isMounted = true;
  useEffect(() => {
    if (isMounted) {
      getFeed();
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, []);

  // user account
  const connectedAccount = useContext(ConnectedAccount);

  // fx
  if (props.format !== 'searchBar' && props.page === 1 && document.getElementById('dapp')) {
    document.getElementById('dapp').scroll({ top: 0 });
  }

  if (loading) {
    if (props.format === 'searchBar') return null;
    if (props.page > 1) {
      return <Paginator placeholder />;
    }
    return <Placeholder />;
  }
  if (error)
    return (
      <>
        {props.format === 'searchBar' ? (
          <Search />
        ) : (
          <div className="empty failure">{parser(i18n.t('failure', { errorMessage: error }))}</div>
        )}
      </>
    );

  const accountAddress = props.address;
  const timestamp = Math.floor(new Date().getTime() / 1000);

  if (data) {
    if (data.asProposer || data.asApplicant) {
      data.proposals = _orderBy(uniqBy(data.asProposer.concat(data.asApplicant), 'id'), 'createdAt', 'desc');
    }

    if (data.proposals.length === 0) {
      if (props.format === 'searchBar') {
        return <Search contextTag={{ id: param, text: i18n.t('search-default', { searchTerm: param }) }} />;
      }
      return (
        <div className="empty-feed">
          <img className="empty-icon" src={notFound} alt="" />
          <h1>{i18n.t('moloch-empty-feed')}</h1>
          {i18n.t('moloch-empty-feed-detail')}
        </div>
      );
    }

    if (props.format === 'searchBar') {
      switch (props.view) {
        case routerView.PROPOSAL:
          return (
            <Search
              contextTag={{
                id: proposalId,
                text: i18n.t('search-contract', { searchTerm: getDescription(data.proposals[0].details).title }),
              }}
            />
          );
        case routerView.SEARCH:
        default:
          return <Search contextTag={{ id: param, text: i18n.t('search-default', { searchTerm: param }) }} />;
      }
    }

    const feed =
      data.proposals &&
      data.proposals.length > 0 &&
      data.proposals.map(proposal => {
        const totalVoters = String(parseInt(Number(proposal.yesVotes) + Number(proposal.noVotes), 10));
        const yesPercentage = String(_getPercentage(Number(proposal.yesShares), Number(proposal.noShares)));
        const noPercentage = String(_getPercentage(Number(proposal.noShares), Number(proposal.yesShares)));
        const daoAddress = proposal.moloch.id;
        const isPoll = proposal.startingPeriod !== '0';
        const isUnsponsored = !isPoll && proposal.molochVersion !== '1' && !proposal.sponsored && !proposal.cancelled;
        const url = `/proposal/${proposal.id}`;

        let status;
        let handIcon = hand;
        let handIconActive = handActive;
        if (proposal.didPass && proposal.processed) {
          status = 'PASSED';
          handIcon = thumbUp;
          handIconActive = thumbUpActive;
        }
        if (!proposal.didPass && proposal.processed) {
          status = 'FAILED';
          handIcon = thumbDown;
          handIconActive = thumbDownActive;
        }
        if (!proposal.processed) {
          status = 'PENDING';
        }
        if (proposal.cancelled) {
          status = 'CANCELLED';
          return null;
        }

        const noShares = proposal.sharesRequested === '0';
        const noTribute = proposal.tributeOffered === '0';
        const noPayment = proposal.paymentRequested === '0';
        const noLoot = proposal.lootRequested === '0';
        const noApplicant = proposal.applicant === '0x0000000000000000000000000000000000000000';
        const noSponsor = !proposal.sponsored || proposal.molochVersion === '1';
        const noConditions =
          noShares &&
          noTribute &&
          noPayment &&
          noApplicant &&
          noSponsor &&
          noLoot &&
          !proposal.whitelist &&
          !proposal.guildkick;

        const voterLabel = Number(totalVoters) === 1 ? i18n.t('voter') : i18n.t('voters');
        const voterCount =
          Number(totalVoters) > 0
            ? i18n.t('see-proposal-vote-count', { totalVoters, voterLabel })
            : i18n.t('no-voters');

        const proposalValue = _getProposalValue(proposal);
        const abiLibrary = 'moloch2';
        const sumArray = [proposal.yesShares, proposal.noShares].reduce((a, b) => a + b, 0);

        function parseData(dt) {
          if (!dt) return {};
          if (typeof dt === 'object') return dt;
          if (typeof dt === 'string') return JSON.parse(dt);

          return {};
        }

        let result;
        if (proposal) {
          try {
            result = parseData(proposal.details);
          } catch (e) {
            return false;
          }
        }

        return (
          <Post
            key={proposal.id}
            accountAddress={accountAddress}
            title={result.title}
            description={result.description}
            // href={url}
            link={result.link}
            memberAddress={proposal.proposer}
            daoAddress={daoAddress}
          >
            <div className="expanders">
              <Expand
                url={url}
                label={proposalValue}
                open={props.view === routerView.PROPOSAL}
                icon={ethereum}
                iconActive={ethereumActive}
              >
                <Contract hidden={noConditions} view={props.view} href={url}>
                  {!noSponsor ? (
                    <Parameter label={i18n.t('moloch-sponsored-by')}>
                      <Account publicAddress={proposal.sponsor} width="16px" height="16px" />
                    </Parameter>
                  ) : null}
                  {!noApplicant ? (
                    <Parameter label={i18n.t('moloch-applicant')}>
                      <Account publicAddress={proposal.applicant} width="16px" height="16px" />
                    </Parameter>
                  ) : null}
                  {!noShares ? (
                    <Parameter label={i18n.t('moloch-request')}>
                      <Token quantity={String(proposal.sharesRequested)} symbol="SHARES" />
                    </Parameter>
                  ) : null}
                  {!noLoot ? (
                    <Parameter label={i18n.t('moloch-loot')}>
                      <Token quantity={String(proposal.lootRequested)} symbol="SHARES" />
                    </Parameter>
                  ) : null}
                  {!noTribute ? (
                    <Parameter label={i18n.t('moloch-tribute')}>
                      <Token
                        quantity={proposal.tributeOffered}
                        publicAddress={proposal.tributeToken}
                        symbol={proposal.tributeTokenSymbol}
                        decimals={proposal.tributeTokenDecimals}
                      />
                    </Parameter>
                  ) : null}
                  {!noPayment ? (
                    <Parameter label={i18n.t('moloch-payment')}>
                      <Token
                        quantity={proposal.paymentRequested}
                        publicAddress={proposal.paymentToken}
                        symbol={proposal.paymentTokenSymbol}
                        decimals={proposal.paymentTokenDecimals}
                      />
                    </Parameter>
                  ) : null}
                  {proposal.whitelist ? (
                    <Parameter label={i18n.t('moloch-token-whitelist')}>
                      <Toggle checked disabled />
                    </Parameter>
                  ) : null}
                  {proposal.guildkick ? (
                    <Parameter label={i18n.t('moloch-token-guildkick')}>
                      <Toggle checked disabled />
                    </Parameter>
                  ) : null}
                </Contract>
              </Expand>
              <Expand
                url={url}
                label={voterCount}
                open={props.view === routerView.PROPOSAL}
                icon={handIcon}
                iconActive={handIconActive}
              >
                {isPoll ? (
                  <Poll>
                    <Countdown
                      now={timestamp}
                      votingPeriodBegins={proposal.votingPeriodStarts}
                      votingPeriodEnds={proposal.votingPeriodEnds}
                      gracePeriodEnds={proposal.gracePeriodEnds}
                    />
                    <Survey>
                      <Grid container justifyContent="center">
                        <Grid item className="pool-choice-content">
                          <Choice
                            now={timestamp}
                            accountAddress={connectedAccount}
                            publicAddress={proposal.moloch.id}
                            description={proposal.details}
                            proposalIndex={proposal.proposalIndex}
                            label={i18n.t('yes')}
                            voteValue={defaults.YES}
                            showVotedIcon={proposal.votes[0]?.uintVote === 1 ? true : false}
                            data={[proposal.yesShares]}
                            backgroundColor="var(--positive-signal-color)"
                            votingPeriodEnds={proposal.votingPeriodEnds}
                            votingPeriodBegins={proposal.votingPeriodStarts}
                            totalVotes={String(totalVoters)}
                            abi={abiLibrary}
                          />
                          <Choice
                            now={timestamp}
                            accountAddress={connectedAccount}
                            publicAddress={proposal.moloch.id}
                            description={proposal.details}
                            proposalIndex={proposal.proposalIndex}
                            label={i18n.t('no')}
                            voteValue={defaults.NO}
                            showVotedIcon={proposal.votes[0]?.uintVote === 2 ? true : false}
                            data={[proposal.noShares]}
                            backgroundColor="var(--negative-signal-color)"
                            votingPeriodEnds={proposal.votingPeriodEnds}
                            votingPeriodBegins={proposal.votingPeriodStarts}
                            abi={abiLibrary}
                          />
                        </Grid>
                        <Grid item className="pool-choice-Doughnut">
                          <Doughnut
                            data={{
                              labels: ['yes', 'no'],
                              datasets: [
                                {
                                  label: ['yes', 'no'],
                                  data: sumArray === '000' ? [1, 1] : [proposal.yesShares, proposal.noShares],
                                  backgroundColor: ['#01c190', '#ff3d67'],
                                  cutout: '75%',
                                  hoverOffset: 3,
                                  borderColor: '#fff',
                                  hoverBorderColor: ['#e8f4fd'],
                                },
                              ],
                            }}
                            plugins={
                              [{
                              id: 'text',
                              beforeDraw: function(chart) {
                                var width = chart.width,
                                  height = chart.height,
                                  ctx = chart.ctx;
                                ctx.restore();
                                var fontSize = (height / 200).toFixed(2);
                                ctx.font = fontSize + "em sans-serif";
                                ctx.textBaseline = "middle";
                      
                                var text = sumArray === '000' ? 'VOTE NOW' : `VOTES: ${totalVoters}`,
                                  textX = Math.round((width - ctx.measureText(text).width) / 2),
                                  textY = height / 2;
                      
                                ctx.fillText(text, textX, textY);
                                ctx.save();
                              }
                            }]
                            }
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              animation: {
                                animateScale: true,
                                duration: 1000,
                              },
                              plugins: {
                                ChartDataLabels,
                                datalabels: {
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
                                  borderRadius: 50,
                                  borderWidth: 2,
                                  color: 'black',
                                  font: {
                                    weight: 'bold',
                                    size: 10,
                                  },
                                  padding: 5,
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Survey>
                    <Period
                      now={timestamp}
                      url={url}
                      status={status}
                      votingPeriodBegins={proposal.votingPeriodStarts}
                      votingPeriodEnds={proposal.votingPeriodEnds}
                      gracePeriodEnds={proposal.gracePeriodEnds}
                    />
                  </Poll>
                ) : null}
              {isUnsponsored ? (
                <>
                  <div style={{ paddingTop: '10px' }}>
                    <button
                      className="submit-sponsor glow-on-hover"
                      onClick={() => sponsorProposal(connectedAccount, daoAddress, proposal.proposalId)}
                    >
                      Sponsor proposal
                    </button>
                  </div>
                  <div className="alert-style">
                    <Alert
                      className="warning period period-unsponsored"
                      severity="warning"
                      variant="standard"
                      url={url}
                      tooltip={i18n.t('moloch-open-proposal')}
                    >
                      {i18n.t('moloch-flag-unsponsored')}
                    </Alert>
                  </div>
                </>
              ) : null}
              {proposal.cancelled ? (
                <div className="alertStyle">
                  <Alert
                    className="warning period period-cancelled"
                    severity="error"
                    variant="standard"
                    url={url}
                    tooltip={i18n.t('moloch-open-proposal')}
                  >
                    {i18n.t('moloch-flag-cancelled')}
                  </Alert>
                </div>
              ) : null}
            </Expand>
          </div>
          <Social url={url} description={proposal.details}>
            <Stamp url={url} timestamp={proposal.createdAt} />
          </Social>
        </Post>
      );
    });

    return (
      <>
        {feed}
        {data.proposals.length >= props.first ? (
          <Paginator page={props.page}>
            <Timeline
              address={props.address}
              period={props.period}
              view={props.view}
              proposalId={props.proposalId}
              field="memberAddress"
              first={props.first}
              skip={parseInt(props.first * props.page, 10)}
              page={parseInt(props.page + 1)}
              orderBy="createdAt"
              orderDirection="desc"
              param={props.param}
            />
          </Paginator>
        ) : null}
      </>
    );
  }
  return null;
};

const Timeline = function (props) {
  return (
    <ApolloProvider client={client}>
      <Feed
        address={props.address}
        period={props.period}
        view={props.view}
        field={props.field}
        page={props.page}
        proposalId={props.proposalId}
        first={props.first}
        skip={props.skip}
        orderBy={props.orderBy}
        orderDirection={props.orderDirection}
        format={props.format}
        param={props.param}
      />
    </ApolloProvider>
  );
};

Timeline.propTypes = {
  field: PropTypes.string,
  address: PropTypes.string,
  proposalId: PropTypes.string,
  first: PropTypes.number,
  skip: PropTypes.number,
  page: PropTypes.number,
  orderBy: PropTypes.string,
  orderDirection: PropTypes.string,
  view: PropTypes.string,
  period: PropTypes.string,
  format: PropTypes.string,
  param: PropTypes.string,
};

Feed.propTypes = Timeline.propTypes;

export default Timeline;
