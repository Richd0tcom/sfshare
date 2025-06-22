import { Knex } from "knex"; 

// import { hashPassword } from "../../common/helpers/password";
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {

    const roleIds = {
        employee: uuidv4(),
        manager: uuidv4(),
        admin: uuidv4(),
    };

    await knex('roles').insert([
        { id: roleIds.employee, name: 'employee', status: 'active' },
        { id: roleIds.manager, name: 'manager', status: 'active' },
        { id: roleIds.admin, name: 'admin', status: 'active' },
    ]);

    const adminUserId = uuidv4();
    await knex('users').insert([
        {
            id: adminUserId,
            email: 'admin@example.com',
            roleId: roleIds.admin,
            password: hashPassword('123')
        },
    ]);


};
