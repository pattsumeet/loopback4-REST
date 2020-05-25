
// Uncomment these imports to begin using these cool features!

import { post, getJsonSchema, requestBody } from '@loopback/openapi-v3';
import { User } from '../models/user.model';
import { validateCredentials } from '../services/validator';
import { UserRepository } from '../repositories/user.repository';
import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { PasswordHasherBindings } from '../services/keys';
import { BcryptHasher } from '../services/has.password.bcrypt';
import * as _ from 'lodash';
import { PermissionKeys } from '../authorization/permission-keys';

// import {inject} from '@loopback/context';


export class AdminController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  @post('/admin', {
    responses: {
      '200': {
        description: 'Admin',
        content: {
          schema: getJsonSchema(User),
        }
      },
    }
  })
  async create(@requestBody() admin: User) {
    validateCredentials(_.pick(admin, ['email', 'password']));
    admin.permissions = [
      PermissionKeys.CreateJob,
      PermissionKeys.UpdateJob,
      PermissionKeys.DeleteJob,
    ];
    admin.password = await this.hasher.hashPassword(admin.password);
    const saveAdmin = await this.userRepository.create(admin);
    delete saveAdmin.password;
    return saveAdmin;
  }
  
}
