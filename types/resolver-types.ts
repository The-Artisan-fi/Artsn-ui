import { Db } from 'mongodb';

export interface Context {
    db: Db;
    user: {
      _id: string;
      email: string;
      publicKey: string;
    };
}