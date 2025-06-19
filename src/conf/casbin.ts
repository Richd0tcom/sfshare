import { Enforcer, newEnforcer } from "casbin";

const policies = [

    ['admin', 'files', 'create'],
    ['admin', 'files', 'read'],
    ['admin', 'files', 'update'],
    ['admin', 'files', 'delete'],
    ['admin', 'users', 'read'],
    ['admin', 'audit', 'read'],
    ['super_admin', 'roles', 'create'],


    ['manager', 'files', 'create'],
    ['manager', 'files', 'read'],
    ['manager', 'files', 'update'],


    ['employee', 'files', 'create'],
    ['employee', 'files', 'read'],
];

export const defineActions = (method: string): string => {
    switch (method) {
        case "POST":
            return 'upload'
        case "PATCH":
            return "update"
        case "GET":
            return "read"
        default:
            return ""
    }
}

let enforcer: Enforcer;

export const initCasbin = async (): Promise<Enforcer> => {

    enforcer = await newEnforcer('casbin.conf');

    for (const policy of policies) {
        await enforcer.addPolicy(...policy);
    }

    return enforcer;
};

export const getEnforcer = (): Enforcer => {
    if (!enforcer) {
        throw new Error('Casbin enforcer not initialized');
    }
    return enforcer;
};