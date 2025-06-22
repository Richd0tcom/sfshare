import { Model } from 'objection';
import Knex from 'knex';
import knexfile from './knexfile';

export function dbSetup() {
  const ENV = process.env.NODE_ENV;
  if (ENV == 'production' || ENV == 'staging') {
    const conn = Knex(knexfile.production);
    Model.knex(conn);
  } else {
    const conn = Knex(knexfile.development);
    Model.knex(conn);
  }
}
