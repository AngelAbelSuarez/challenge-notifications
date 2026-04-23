export const userData = {
  name: 'newuser',
  email: 'new@example.com',
  password: 'newpassword123',
};

export let tokenUser: string = '';

export const loginUser = async (token: string) => {
  tokenUser = token;
};

export const userData2 = {
  name: 'newuser2',
  email: 'new2@example.com',
  password: 'newpassword123',
};

export const idUserNotFound = '17a6b856-03d8-44a5-a87f-cf76fcc67f45';

export const adminData = {
  name: 'admin',
  email: 'admin@example.com',
  password: 'adminpassword123',
};

export let tokenAdmin: string = '';

export const loginAdmin = async (token: string) => {
  tokenAdmin = token;
};
