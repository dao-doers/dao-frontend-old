# Deploy to testnet

## 1. Start Graph Node

```
git clone https://github.com/Kuzirashi/graph-node.git
cd graph-node
```

Set correct network in docker/docker-compose.yml, eg.:

```
ethereum: 'godwoken-testnet:no_eip1898,archive,traces:https://godwoken-testnet-web3-rpc.ckbapp.dev'
```

(Optional) If you use HTTPS

Then use following for docker/docker-compose.yml:

```
version: '3'
services:
  graph-node:
    image: graphprotocol/graph-node
    ports:
      - '8000:8000'
      - '8001:8001'
      - '8020:8020'
      - '8030:8030'
      - '8040:8040'
    depends_on:
      - ipfs
      - postgres-graph
    environment:
      postgres_host: postgres-graph
      postgres_user: graph-node
      postgres_pass: let-me-in
      postgres_db: graph-node
      ipfs: 'ipfs:5001'
      ethereum: 'godwoken-testnet:no_eip1898,archive,traces:https://godwoken-testnet-web3-rpc.ckbapp.dev'
      GRAPH_LOG: info
      GRAPH_GETH_ETH_CALL_ERRORS: 'invalid exit code 2;'
  ipfs:
    image: ipfs/go-ipfs:v0.4.23
    ports:
      - '5001:5001'
    volumes:
      - ./data/ipfs:/data/ipfs
  postgres-graph:
    image: postgres
    ports:
      - '5400:5432'
    command: ["postgres", "-cshared_preload_libraries=pg_stat_statements"]
    environment:
      POSTGRES_USER: graph-node
      POSTGRES_PASSWORD: let-me-in
      POSTGRES_DB: graph-node
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
  proxy:
    image: fsouza/docker-ssl-proxy:latest
    ports:
      - '8443:8443'
    depends_on:
      - graph-node
    labels:
      com.dnsdock.name: proxy
      com.dnsdock.image: projectname
    environment:
      DOMAIN: nervosdao.community
      SSL_PORT: 8443
      TARGET_PORT: 8000
      TARGET_HOST: 172.31.23.246
    volumes:
      - ./data/https:/etc/nginx/certs
```

Now run:

```
cd /home/dao/graph-node
docker-compose -f docker/docker-compose.yml up -d
```

## 3. Deploy smart contracts

```
cd moloch

```

## 4. Deploy Subgraph

```
yarn create:testnet
yarn deploy:testnet
```

```
Deployed to http://144.126.223.15:8000/subgraphs/name/odyssy-automaton/daohaus/graphql

Subgraph endpoints:
Queries (HTTP):     http://144.126.223.15:8000/subgraphs/name/odyssy-automaton/daohaus
Subscriptions (WS): http://144.126.223.15:8001/subgraphs/name/odyssy-automaton/daohaus
```

## 5. Start website

```
cd ~/projects/democracy-dapp
npm run start
```

Open:

```
http://localhost:3000/
```

# Deploy to testnet

## 1. Deploy smart contracts

Make sure deployment-params TOKEN is set to dCKB SUDT-ERC20 proxy address on correct network you're deploying for (eg. testnet). Then in smart-contracts directory run:

```
npx hardhat moloch-deploy --network testnet
```

Example result:
```
Nothing to compile
Deploying a new DAO to the network 
Deployment parameters:
   summoner: 0xd9066ff9f753a1898709b568119055660a77d9aae4d7a4ad677b8fb3d2a571e5 
   token (dCKB): 0xC03Da4356B4030f0EC2494C18DCFA426574e10D5 
   periodSeconds: 30 
   votingPeriods: 35 
   gracePeriods: 35 
   abortPeriods: undefined 
   proposalDeposit: 1000000000000000000 
   dilutionBound: 3 
   processingReward: 10000000000 

Deploying...
...

Moloch DAO deployed. Address: 0xCf168324aC360889Dc963793E15de30FcDc3EaeC
Set this address in buidler.config.js's networks section to use the other tasks
```

## 4. Deploy Subgraph

Copy deployed Moloch DAO address eg. "0xCf168324aC360889Dc963793E15de30FcDc3EaeC" and change it in subgraph directory subraph.yml file (MolochV2.source.address). Eg. final code:
```
- kind: ethereum/contract
    name: MolochV2
    network: godwoken-testnet
    source:
      address: '0xCf168324aC360889Dc963793E15de30FcDc3EaeC'
      abi: V2Moloch
      startBlock: 1
```

Then run (in subgraph directory):
```
yarn build:all
yarn remove:testnet
yarn create:testnet
yarn deploy:testnet
```

Example result:
```
✔ Upload subgraph to IPFS

Build completed: QmcPHLC3KYu7kgxmPsniLnazPBQLifhggRLSS7UWzHHBP9

Deployed to http://3.70.170.207:8000/subgraphs/name/odyssy-automaton/daohaus/graphql

Subgraph endpoints:
Queries (HTTP):     http://3.70.170.207:8000/subgraphs/name/odyssy-automaton/daohaus
Subscriptions (WS): http://3.70.170.207:8001/subgraphs/name/odyssy-automaton/daohaus

Done in 41.37s.
```

## 5. Start website

```
cd ~/projects/dao-frontend
npm run start
```

Open:

```
http://localhost:3000/
```
