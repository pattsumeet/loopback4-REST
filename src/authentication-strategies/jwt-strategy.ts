import { AuthenticationStrategy, TokenService } from '@loopback/authentication'
import { UserProfile } from '@loopback/security'
import { Request, HttpErrors } from '@loopback/rest'
import { inject } from '@loopback/core';
import { TokenServiceBindings } from '../services/keys';
// import { JWTservice } from '../services/jwt-service';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {

    constructor(
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public tokenService: TokenService,
        // public jwtService: JWTservice,
        ) {}

    name: string = 'jwt';

    async authenticate(request: Request,): Promise<UserProfile | undefined> {
        const token = this.extractCredentials(request);
        // const userProfile = await this.jwtService.verifyToken(token);
        const userProfile: UserProfile = await this.tokenService.verifyToken(token);
        // return Promise.resolve(userProfile);
        return userProfile;
    }

    extractCredentials(request: Request): string {
        if(!request.headers.authorization) {
            throw new HttpErrors.Unauthorized('Headers missing!');
        }

        const authHeaderValue = request.headers.authorization;

        if(!authHeaderValue.startsWith('Bearer')) {
            throw new HttpErrors.Unauthorized('Token type is not of type bearer!');
        }
        const parts = authHeaderValue.split(' ');
        if (parseInt.length !== 2) {
            throw new HttpErrors.Unauthorized('Auth header has too many parts');
        }
        const token = parts[1];
        return token;
    }
}