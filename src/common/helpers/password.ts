import {hashSync, compare} from 'bcrypt';

const saltOrRounds = 10;

export const hashPassword = (password: string, salt: number =saltOrRounds): string =>  hashSync(password, salt);


export const checkPassword = (password: string, hashedPassword: string): Promise<boolean> => compare(password, hashedPassword)
