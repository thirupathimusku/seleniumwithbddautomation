/**
 * User Schema Definitions
 * Define expected JSON schemas for user-related API responses
 */

export const UserSchema = {
  id: { type: 'number', required: true },
  username: { type: 'string', required: true },
  userRole: { type: 'object', required: false },
  empNumber: { type: 'number', required: false },
  status: { type: 'boolean', required: false },
  deleted: { type: 'boolean', required: false },
};

export const UserListSchema = {
  data: { type: 'object', required: true },
  meta: { type: 'object', required: false },
  rels: { type: 'object', required: false },
};

export const UserRoleSchema = {
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
  displayName: { type: 'string', required: false },
};

export const CreateUserRequestSchema = {
  username: { type: 'string', required: true },
  password: { type: 'string', required: true },
  status: { type: 'boolean', required: false },
  userRoleId: { type: 'number', required: true },
  empNumber: { type: 'number', required: false },
};

export const UpdateUserRequestSchema = {
  username: { type: 'string', required: false },
  password: { type: 'string', required: false },
  status: { type: 'boolean', required: false },
  userRoleId: { type: 'number', required: false },
  empNumber: { type: 'number', required: false },
};

/**
 * Example expected responses
 */
export const ExampleResponses = {
  successfulLogin: {
    success: true,
    user: {
      id: 1,
      username: 'Admin',
      userRole: {
        id: 1,
        name: 'Admin',
      },
    },
  },

  failedLogin: {
    error: 'Invalid credentials',
  },

  userList: {
    data: [
      {
        id: 1,
        username: 'Admin',
        userRole: {
          id: 1,
          name: 'Admin',
          displayName: 'Administrator',
        },
        status: true,
        deleted: false,
      },
    ],
    meta: {
      total: 1,
    },
  },

  userDetail: {
    data: {
      id: 1,
      username: 'Admin',
      userRole: {
        id: 1,
        name: 'Admin',
        displayName: 'Administrator',
      },
      employee: {
        empNumber: 1,
        firstName: 'Admin',
        lastName: 'User',
      },
      status: true,
      deleted: false,
    },
  },
};
