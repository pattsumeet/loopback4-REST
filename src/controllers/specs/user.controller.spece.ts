export const CredentialsSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string',
            minlength: 8
        }
    }
}

export const CredentialBody = {
    description: 'Input for login function',
    required: true,
    content: {
        'application/json': {schema: CredentialsSchema},
    }
}

export const UserProfileSchema = {
    type: 'object',
    required: ['id'],
    properties: {
      id: {type: 'string'},
      email: {type: 'string'},
      name: {type: 'string'},
    },
  };
