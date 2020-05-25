import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  inject,
  Getter,
} from '@loopback/context';
import { AuthenticationBindings, AuthenticationMetadata } from '@loopback/authentication'
import { RequiredPermissions } from '../types';
import { HttpErrors } from '@loopback/rest-explorer/node_modules/@loopback/rest';
import { UserProfile } from '@loopback/security';
import {intersection} from 'lodash';
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'Authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {
  /*
  constructor() {}
  */
  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<UserProfile>,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      // console.log('Log from authorize global interceptor');
      // console.log(this.metadata);
      //if you will not provide options in your @authenticate decorator
      //this line will be executed
      if (!this.metadata) return await next();

      const result = await next();
      const requiredPermissions = this.metadata.options as RequiredPermissions;      
      // console.log(Object.keys(requiredPermissions));
      // console.log(Object.values(requiredPermissions));
      const user = await this.getCurrentUser();
      console.log('User Permissions: ', user.permissions);

      const results = intersection(
        user.permissions,
        Object.values(requiredPermissions),
      );
      console.log(results);
      if (results.length !== Object.values(requiredPermissions).length) {
        throw new HttpErrors.Forbidden('INVALID ACCESS PERMISSIONS');
      }

      //check the user permissions
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
