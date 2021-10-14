# Deploy to testnet

## 1. Start Graph Node

Set correct network in docker/docker-compose.yml, eg.:
```
ethereum: 'godwoken-testnet:no_eip1898,archive,traces:https://godwoken-testnet-web3-rpc.ckbapp.dev'
```

```
cd /home/dao/graph-node
docker-compose -f docker/docker-compose.yml up-d
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