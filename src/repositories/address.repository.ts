import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {Address, AddressRelations, Student} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StudentRepository} from './student.repository';

export class AddressRepository extends DefaultCrudRepository<
  Address,
  typeof Address.prototype.id,
  AddressRelations
> {

  public readonly student: HasOneRepositoryFactory<Student, typeof Address.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('StudentRepository') protected studentRepositoryGetter: Getter<StudentRepository>,
  ) {
    super(Address, dataSource);
    this.student = this.createHasOneRepositoryFactoryFor('student', studentRepositoryGetter);
    this.registerInclusionResolver('student', this.student.inclusionResolver);
  }
}
