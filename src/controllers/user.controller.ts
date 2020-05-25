// Uncomment these imports to begin using these cool features!

import { repository } from '@loopback/repository';
import { UserRepository, Credentials } from '../repositories/user.repository';
import { post, get, getJsonSchema, requestBody } from '@loopback/rest';
import { User } from '../models/user.model';
import * as _ from 'lodash';
import { validateCredentials } from '../services/validator';
import { inject } from '@loopback/core';
import { BcryptHasher } from '../services/has.password.bcrypt';
import { CredentialBody, UserProfileSchema } from './specs/user.controller.spece';
import { MyUserService } from '../services/user.service';
import { JWTService } from '../services/jwt-service';
import { UserProfile, securityId, SecurityBindings } from "@loopback/security";
// import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { authenticate } from '@loopback/authentication';
import { PasswordHasherBindings, UserServiceBindings, TokenServiceBindings } from '../services/keys';
import { PermissionKeys } from '../authorization/permission-keys';
import { OPERATION_SECURITY_SPEC } from '../utils/security-specs';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) {}    


  @post('/user/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchema(User),
        }
      },
    }
  })
  async signup(@requestBody() userData: User) {
    validateCredentials(_.pick(userData, ['email', 'password']));
    userData.permissions = [PermissionKeys.AccessAuthFeature];
    userData.password = await this.hasher.hashPassword(userData.password);
    const saveUser = await this.userRepository.create(userData);
    delete saveUser.password;
    return saveUser;
  }

  @post('/user/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                }
              }
            }   
          }
        }
      }
    },
  })
  async login(@requestBody(CredentialBody) credentials: Credentials): Promise<{token: string}> {
    // make sure exists and password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    
    const userProfile = await this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token});
    // return {token}
  }


  // @get('user/me') 
  // @authenticate('jwt')
  // async me(@inject(
  //   AuthenticationBindings.CURRENT_USER)
  //   currentUser: UserProfile,
  //   ): Promise<UserProfile> {
  //   return Promise.resolve({[securityId]: '1', name: 'Sumeet'});
  // }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }
}
