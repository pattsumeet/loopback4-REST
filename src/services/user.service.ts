import { UserService } from '@loopback/authentication';
import { User } from '../models/user.model';
import { Credentials, UserRepository } from '../repositories/user.repository';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { BcryptHasher } from './has.password.bcrypt';
import { UserProfile, securityId } from "@loopback/security";
import { PasswordHasherBindings } from './keys';
import { toJSON } from '@loopback/testlab';
import { pick } from 'lodash';

export class MyUserService implements UserService<User, Credentials> {
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public hasher: BcryptHasher,
    ){}

    async verifyCredentials(credentials: Credentials): Promise<User> {
        const foundUser = await this.userRepository.findOne({
            where: {
                email: credentials.email
            }
        });

        if(!foundUser) {
            throw new HttpErrors.NotFound(`User not found for email: ${credentials.email}`);
        }
        const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUser.password);
        if(!passwordMatched) {
            throw new HttpErrors.Unauthorized('Password is not valid');
        }

        return foundUser;

    }
    
    convertToUserProfile(user: User): UserProfile {
        let userName = '';
        if (user.firstName) userName = `${user.firstName}`;
        if (user.lastName)
        userName = user.firstName
            ? `${userName} ${user.lastName}`
            : `${user.lastName}`;
        let userProfile = {[securityId]: `${user.id}`, id: user.id, name: userName, permissions: user.permissions};
        delete userProfile[securityId];
        return userProfile;
    }
    
    // convertToUserProfile(user: User): UserProfile {
    //     throw new Error("Method not implemented.");
    // }
    
}