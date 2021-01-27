# feezy-auth
This is a service responsible for AUTH related tasks and user mgmt tasks. 

## Service Architecture:
Node.js backend with MongoDB clsuter

## Service Features:

## Build Steps:
* **docker-compose** - development `sh start.sh`
* **swarm mode** - production-like: `./deploy`

## Run Tests:
./test.sh

## Healthcheck:

1.  Endpoint: `/healthcheck`
2.  Expected HTTP Response Code: **200**

## SmokeTest:
1.  Endpoint: `/healthcheck`
2.  Expected HTTP Response Code: **200**

## Service Logging:

1.  Log Levels supported: **trace, debug, info, warn, error, fatal**
2.  Default Loglevel: **debug**
3.  Log Formats supported: **Log4js**

## Environment Variables:

**(Required)**

1. `NODE_ENV=production` 
2. `LOGGER_CONFIG={"disableClustering":true,"appenders":{"out":{"type":"stdout","layout":{"type":"pattern","pattern":"%[ [%d] [%p] %] %c - %x{correlationId} - %m"}}},"categories":{"default":{"appenders":["out"],"level":"trace"}}}`
3. `MONGO_DB_URL=mongo-uri`

## Service Dependencies:
### Upstream
1. Client facing ...

### Downstream
1. MongoDB

## Ports Used:
* **80**

## API
[Postman API Docs]()
