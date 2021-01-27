import { Collection } from 'mongodb';
import { Repo } from './RepoNames';
import { getMongoClient } from '../initializer';
import { ISignupClaims } from '../models/requests/IIDPSignupRequest';

export class UserAccountRepository {
  protected _collection: Collection;

  constructor() {
    this._collection = getMongoClient().collection(Repo.UserAccounts);
  }

  async save(data: ISignupClaims) {
    return this._collection.insertOne(data);
  }
}
