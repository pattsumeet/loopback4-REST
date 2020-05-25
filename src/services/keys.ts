

export namespace TokenServiceConstant {
    export const TOKEN_SERVICE_SECRET = '138asda8213';
    export const TOKEN_SERVICE_EXPIRESIN = '7h';
}

export namespace TokenServiceBindings {
    export const TOKEN_SECRET = 'jwt-service.secret';
    export const TOKEN_EXPIRESIN = 'jwt-service.expiresin';
    export const TOKEN_SERVICE = 'services.jwt.service';
}

export namespace PasswordHasherBindings {
    export const PASSWORD_HASHER = 'services.hasher';
    export const ROUNDS = 'services.hasher.rounds';
  }
  
  export namespace UserServiceBindings {
    export const USER_SERVICE = 'services.user.service';
  }