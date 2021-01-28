import { Collection } from 'mongodb';
import { Repo } from './RepoNames';
import { getMongoClient } from '../initializer';
import { ISignupClaims } from '../models/requests/IIDPSignupRequest';
import { IClaims } from '../models/ITokenWithUser';

export class UserAccountRepository {
  protected _collection: Collection;

  constructor() {
    this._collection = getMongoClient().collection(Repo.UserAccounts);
  }

  async save(data: ISignupClaims) {
    return this._collection.insertOne(data);
  }

  async findOne(data: any) {
    return this._collection.findOne<IClaims>({ ...data });
  }
}
