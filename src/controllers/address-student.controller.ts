import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Address,
  Student,
} from '../models';
import {AddressRepository} from '../repositories';

export class AddressStudentController {
  constructor(
    @repository(AddressRepository) protected addressRepository: AddressRepository,
  ) { }

  @get('/addresses/{id}/student', {
    responses: {
      '200': {
        description: 'Address has one Student',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Student),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Student>,
  ): Promise<Student> {
    return this.addressRepository.student(id).get(filter);
  }

  @post('/addresses/{id}/student', {
    responses: {
      '200': {
        description: 'Address model instance',
        content: {'application/json': {schema: getModelSchemaRef(Student)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Address.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudentInAddress',
            exclude: ['id'],
            optional: ['addressId']
          }),
        },
      },
    }) student: Omit<Student, 'id'>,
  ): Promise<Student> {
    return this.addressRepository.student(id).create(student);
  }

  @patch('/addresses/{id}/student', {
    responses: {
      '200': {
        description: 'Address.Student PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.addressRepository.student(id).patch(student, where);
  }

  @del('/addresses/{id}/student', {
    responses: {
      '200': {
        description: 'Address.Student DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.addressRepository.student(id).delete(where);
  }
}
