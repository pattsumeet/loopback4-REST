import {DefaultCrudRepository} from '@loopback/repository';
import {User} from '../models/user.model';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export type Credentials = {
  email: string,
  password: string
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(User, dataSource);
  }
}
