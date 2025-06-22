import { compose } from 'objection';
// import { KnexInstance } from './index';
// import * as guid from 'objection-guid';
import guid from 'objection-guid';
import visibility from 'objection-visibility';
import { DBErrors } from 'objection-db-errors';


// Model.knex(KnexInstance);

const modelUuid = guid()
/**
 * mixin plugin for UUID, Database errors and field visibility
 */
const mixins = compose(visibility, DBErrors, modelUuid)


export default mixins;

