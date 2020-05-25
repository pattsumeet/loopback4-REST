import { genSalt, hash, compare } from 'bcryptjs';
import { inject } from '@loopback/core';
import { PasswordHasherBindings } from './keys';

interface PasswordHasher <T = string> {
    hashPassword(password: T): Promise<T>;
    comparePassword(providedPassword: T, StoredPassword: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
    async comparePassword(providedPassword: string, StoredPassword: string): Promise<boolean> {
        const passwordMatched = await compare(providedPassword, StoredPassword);
        return passwordMatched;
    }
    @inject(PasswordHasherBindings.ROUNDS)
    public readonly rounds: number;
    async hashPassword(password: string) {
        const salt = await genSalt(this.rounds);
        return await hash(password, salt);
    }
}