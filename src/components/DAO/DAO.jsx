import React from 'react';
import PropTypes from 'prop-types';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { findLast } from 'lodash';

import { gui } from 'lib/const';
import { shortenCryptoName } from 'utils/strings';
import Search, { includeInSearch } from 'components/Search/Search';

import i18n from 'i18n';
import { config } from 'config'
import flag from 'images/flag.svg';
import 'styles/Dapp.css';

const client = new ApolloClient({
  uri: config.graph.moloch,
  cache: new InMemoryCache(),
});

export const GET_DAO = `
{
  moloches(first: 1000) {
    id
    title
    version
  }
}
`;

/**
* @summary renders a post in the timeline
*/
const DAOQuery = ({ publicAddress, width, height, format }) => {
  const { loading, error, data } = useQuery(gql(GET_DAO.replace('{{molochAddress}}', publicAddress)));

  const image = flag;
  const url = `/dao/${publicAddress}`;
  const finalWidth = width || '24px';
  const finalHeight = height || '24px';

  if (loading) {
    return null;
  }
  if (error) return null /* <div className="empty failure">{parser(i18n.t('failure-short', { errorMessage: error }))}</div>; */

  console.log('findLast', {
    findLast,
    found: findLast(data.moloches, { id: publicAddress })
  });
  const daoTitle = findLast(data.moloches, { id: publicAddress.toLowerCase() }).title;
  let label;
  if (!daoTitle) {
    label = shortenCryptoName(publicAddress);
  } else {
    label = (daoTitle.length > gui.MAX_LENGTH_ACCOUNT_NAMES) ? `${daoTitle.slice(0, gui.MAX_LENGTH_ACCOUNT_NAMES)}...` : daoTitle;
  }

  includeInSearch(url, daoTitle, 'search-collective');

  if ((format === 'searchBar')) {
    return <Search contextTag={{ id: publicAddress, text: i18n.t('search-collective', { searchTerm: daoTitle }) }} />
  }
  return (
    <div className="dao">
      {(format === 'plainText') ?
        <div>
          <img src={image} className="symbol dao-pic dao-pic-sidebar" alt="" style={{ width: finalWidth, height: finalHeight }} />
          <div className="identity-peer">
            {(label.length > gui.MAX_LENGTH_ACCOUNT_NAMES) ? `${label.substring(0, gui.MAX_LENGTH_ACCOUNT_NAMES)}...` : label}
          </div>
        </div>
        :
        <div className="avatar-editor">
          <img src={image} className="symbol dao-pic" alt="" style={{ width: finalWidth, height: finalHeight }} />
          <div className="identity-peer">
            <Link to={url} title={publicAddress} className="identity-label identity-label-micro identity-label-dao" onClick={(e) => { e.stopPropagation(); }}>
              {(label.length > gui.MAX_LENGTH_ACCOUNT_NAMES) ? `${label.substring(0, gui.MAX_LENGTH_ACCOUNT_NAMES)}...` : label}
            </Link>
          </div>
        </div>
      }
    </div>
  );
};

DAOQuery.propTypes = {
  publicAddress: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  format: PropTypes.string,
};


/**
* @summary renders a post in the timeline
*/
const DAO = (props) => {
  return (
    <ApolloProvider client={client}>
      <DAOQuery publicAddress={props.publicAddress} width={props.width} height={props.height} format={props.format} />
    </ApolloProvider>
  );
};

DAO.propTypes = DAOQuery.propTypes;

export default DAO;
