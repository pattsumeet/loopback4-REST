import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongods',
  connector: 'mongodb',
  url: '',
  host: '127.0.0.1',
  port: 27017,
  user: '',
  password: '',
  database: 'lb4-demo',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongods';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongods', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
