import type { Knex } from 'knex';

/**
 * Author: @Richdotcom
 * ******************************************
 * *              DO NOT EDIT               *
 * ******************************************   
 * 
 * Database migrations for KnexJS
 *       
 */
export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable('roles', (table) => {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable().unique();
      table.string('status').notNullable().defaultTo('active');
      table.timestamps(true, true);
    })
    .createTable('rolePermissions', (table) => {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('roleId').notNullable().references('id').inTable('roles').onDelete('CASCADE');
      table.string('roleName').notNullable();
      table.string('object').notNullable();
      table.string('action').notNullable();
      table.timestamps(true, true, true);
    })
    .createTable('users', (table) => {
      table.uuid('id').primary().notNullable().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .string('email')
        .notNullable()
        .unique()
        .index('users_email_index');
      table.string('password').notNullable();
      table.uuid('roleId').notNullable().references('id').inTable('roles').onDelete('CASCADE');
      table.timestamps(true, true, true);
    })
    .createTable('files', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('filename', 255).notNullable();
      table.string('originalName', 255).notNullable();
      table.string('filePath', 500).notNullable();
      table.bigInteger('fileSize').notNullable();
      table.string('mimeType', 100).notNullable();
      table.string('encryptionKey', 255);
      table.uuid('ownerId').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('permissionLevel', 50).notNullable().defaultTo('private');
      table.specificType('tags', 'text[]').defaultTo(knex.raw('ARRAY[]::text[]'));
      table.jsonb('metadata').defaultTo(knex.raw("'{}'::jsonb"));
      
      table.timestamps(true, true, true);
    }).createTable('auditLogs', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('action', 100).notNullable();
      table.string('resourceType', 50).notNullable();
      table.uuid('resourceId');
      table.jsonb('details').defaultTo(knex.raw("'{}'::jsonb"));
      table.specificType('ipAddress', 'inet');
      table.text('userAgent');
      table.timestamps(true, true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
  return await knex.schema
    .dropTableIfExists('auditLogs')
    .dropTableIfExists('files')
    .dropTableIfExists('rolePermissions')
    .dropTableIfExists('roles')
    .dropTableIfExists('users');
}