import loggerFactory from '../utils/logging';
const logger = loggerFactory.getLogger('Config');
interface IConfig {
  port: number;
  production: boolean;
  authorizedRole: string[];
  mongoDbUri: string;
  idPUri: string;
  clientId: string;
  clientSecret: string;
  tenantUserLogin: string;
  idpTenantHostname: string;
  tokenExpiresIn: string;
  issuer: string;
}
const config: IConfig = <IConfig>{
  port: 80,
  production: false,
  tokenExpiresIn: '2h',
  issuer: 'feezy',
};

if (process.env.PORT) config.port = parseInt(process.env.PORT);
if (process.env.NODE_ENV) config.production = process.env.NODE_ENV === 'production';

if (process.env.MONGO_DB_URL) {
  config.mongoDbUri = process.env.MONGO_DB_URL;
} else {
  logger.error('Missing parameter: MONGO_DB_URL! Exiting...');
  process.exit(1);
}

if (typeof process.env.TOKEN_EXPIRE_IN !== 'undefined') {
  config.tokenExpiresIn = process.env.TOKEN_EXPIRE_IN;
} else {
  logger.warn(`setting default value [${config.tokenExpiresIn}] for  TOKEN_EXPIRE_IN ...`);
}

if (typeof process.env.ISSUER !== 'undefined') {
  config.issuer = process.env.ISSUER;
} else {
  logger.warn(`setting default value [${config.issuer}] for  ISSUER ...`);
}

logger.info('Config for the app: %o', config);

export default config;
