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

# Deploy to devnet

## 1. Start network

```
cd ~/projects/godwoken-kicker
make start
```

## 2. Start Graph Node

Set correct ip in docker-compose.yml
```
ip addr show
```

Change it in docker-compose.yml, eg.:
```
ethereum: 'local:no_eip1898,archive,traces:http://172.25.179.106:8024'
```

```
cd ~/projects/graph-node
docker-compose -f docker/docker-compose.yml up
```

## 3. Deploy smart contracts

## 4. Deploy Subgraph

## 5. Start website

```
cd ~/projects/democracy-dapp
npm run start
```

Open:
```
http://localhost:3000/
```