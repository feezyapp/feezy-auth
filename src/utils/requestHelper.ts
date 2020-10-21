import request from 'request';
import loggerFactory from './logging';
import correlationIDHelper from '../utils/correlationIDHelper';
import config from '../config';

const logger = loggerFactory.getLogger('requestHelper');

export default class RequestHelper {
  get<T>(url: string, accessToken?: string) {
    logger.info(`Hitting get with ${url}`);
    const headerBody = {
      Authorization: accessToken ? `${accessToken}` : undefined,
      'vaccination-irp-request-correlation-id': correlationIDHelper.getCorrelationId(),
    };
    return new Promise<T>((resolve, reject) => {
      request(
        url,
        {
          method: 'GET',
          headers: headerBody,
          gzip: true,
          json: true,
          timeout: 600000,
        },
        (error: Error, response: request.Response, body: T) => {
          if (error) return reject(error);
          if (response.statusCode !== 200) return reject(body);
          return resolve(body);
        },
      );
    });
  }

  post<T>(url: string, postBody: T, accessToken?: string) {
    logger.info(`Hitting post with body ${url}`);
    const headerBody = {
      Authorization: accessToken ? `${accessToken}` : undefined,
      'vaccination-irp-request-correlation-id': correlationIDHelper.getCorrelationId(),
    };
    return new Promise<T>((resolve, reject) => {
      request(
        url,
        {
          method: 'POST',
          headers: headerBody,
          gzip: true,
          json: true,
          body: postBody,
          timeout: 600000,
        },
        (error: Error, response: request.Response, body: T) => {
          if (error) return reject(error);
          if (response.statusCode !== 200) return reject(body);
          return resolve(body);
        },
      );
    });
  }

  /**
   * T stands for type and R stands for request type
   */
  postWithAuthFormData<T, R>(url: string, postBody: R, username = config.clientId, password = config.clientSecret) {
    logger.info(
      `Hitting post with form data ${url} with ${JSON.stringify(postBody).replace(
        /password" *: *("(.*?)"(,|\s|)|\s*\{(.*?)\}(,|\s|))/g,
        '',
      )}`,
    );
    return new Promise<T>((resolve, reject) => {
      request(
        `${config.idPUri}/${url}`,
        {
          method: 'POST',
          gzip: true,
          json: true,
          timeout: 600000,
          form: postBody,
          headers: {
            'vaccination-irp-request-correlation-id': correlationIDHelper.getCorrelationId(),
            host: config.idpTenantHostname,
          },
        },
        (error: Error, response: request.Response, body: T) => {
          if (error) return reject(error);
          if (response.statusCode !== 200) return reject(body);
          return resolve(body);
        },
      ).auth(username, password, true);
    });
  }

  /**
   * T stands for type and R stands for request type
   */
  postWithAuthJson<T, R>(url: string, postBody: R, username = config.clientId, password = config.clientSecret) {
    logger.info(
      `Hitting post with form data ${url} with ${JSON.stringify(postBody).replace(
        /password" *: *("(.*?)"(,|\s|)|\s*\{(.*?)\}(,|\s|))/g,
        '',
      )}`,
    );
    return new Promise<T>((resolve, reject) => {
      request(
        `${config.idPUri}/${url}`,
        {
          method: 'POST',
          gzip: true,
          timeout: 600000,
          json: postBody,
          headers: {
            'vaccination-irp-request-correlation-id': correlationIDHelper.getCorrelationId(),
            host: config.idpTenantHostname,
          },
        },
        (error: Error, response: request.Response, body: T) => {
          if (error) return reject(error);
          if (response.statusCode !== 200) return reject(body);
          return resolve(body);
        },
      ).auth(username, password, true);
    });
  }

  put<T>(url: string, postBody: T, accessToken?: string) {
    logger.info(`Hitting put with body ${url}`);
    const headerBody = {
      Authorization: accessToken ? `${accessToken}` : undefined,
      'vaccination-irp-request-correlation-id': correlationIDHelper.getCorrelationId(),
    };
    return new Promise<T>((resolve, reject) => {
      request(
        url,
        {
          method: 'PUT',
          headers: headerBody,
          gzip: true,
          json: true,
          body: postBody,
          timeout: 600000,
        },
        (error: Error, response: request.Response, body: T) => {
          if (error) return reject(error);
          if (response.statusCode !== 200) return reject(body);
          return resolve(body);
        },
      );
    });
  }
}
