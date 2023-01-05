import { request } from '@umijs/max';
export async function createUser(body: API.User, options?: { [key: string]: any }) {
  return request<any>('/user', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


export async function getUserByName(

  params: API.getUserByNameParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<API.User>(`/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}


export async function updateUser(
  
  params: API.updateUserParams,
  body: API.User,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<any>(`/user/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}


export async function deleteUser(
  
  params: API.deleteUserParams,
  options?: { [key: string]: any },
) {
  const { username: param0, ...queryParams } = params;
  return request<any>(`/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}


export async function createUsersWithArrayInput(
  body: API.User[],
  options?: { [key: string]: any },
) {
  return request<any>('/user/createWithArray', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


export async function createUsersWithListInput(body: API.User[], options?: { [key: string]: any }) {
  return request<any>('/user/createWithList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}


export async function loginUser(
  
  params: API.loginUserParams,
  options?: { [key: string]: any },
) {
  return request<string>('/user/login', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function logoutUser(options?: { [key: string]: any }) {
  return request<any>('/user/logout', {
    method: 'GET',
    ...(options || {}),
  });
}
