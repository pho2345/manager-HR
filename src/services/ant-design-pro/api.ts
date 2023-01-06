
import { request } from '@umijs/max';

const serverUrl = 'https://1337-innoria-aleger-n6eaffn9h78.ws-us81.gitpod.io';

export async function currentUser(options?: { [key: string]: any }) {
  const data = await request<API.CurrentUser>(serverUrl + '/api/users/me', {
    method: 'GET',
    ...(options || {}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  return data;
}


export async function outLogin() {
  // return request<Record<string, any>>('/api/login/outLogin', {
  //   method: 'POST',
  //   ...(options || {}),
  // });
  localStorage.setItem('access_token', '')
}


export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  console.log(body);
  return request<API.LoginResult>(serverUrl + '/api/auth/local', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}


export async function rule(
  params: {
    
    current?: number;
  
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}


export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function customAPIGet(values?: { [key: string]: any }, collection?: string) {

  const data = await request<any>(serverUrl+'/api/'+collection, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : `Bearer ${localStorage.getItem('access_token')}` 
    },
    params: {
      ...values,
    },
  });

 
  return {
    data : data.data,
    success: true,
    total : data.meta.pagination.total
  }
}

export async function customAPIAdd(values?: { [key: string]: any }, collection?: string) {
  
  return request<any>(serverUrl+'/api/'+collection, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : `Bearer ${localStorage.getItem('access_token')}` 
    },
    data : {
      data : values
    }
  });
}

export async function customAPIUpdate(values?: { [key: string]: any }, collection?: string, id?: any) {
  return request<any>(serverUrl+'/api/'+collection + `/${id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : `Bearer ${localStorage.getItem('access_token')}` 
    },
    data : {
      data : values
    }
  });
}


export async function customAPIDelete(values?: { [key: string]: any }, collection?: string) {
 
  return request<any>(serverUrl+'/api/'+collection +'/'+ values, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : `Bearer ${localStorage.getItem('access_token')}` 
    },
  });
}

export async function customAPIGetOne(values?: any, collection?: string, params?: { [key: string]: any }) {

  return request<any>(serverUrl+'/api/'+collection +'/'+ values, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : `Bearer ${localStorage.getItem('access_token')}` 
    },
    params: {
      ...params
    }
  });
}

export async function customAPIUpload(values?: { [key: string]: any }) {
  console.log(values);
 
  return request<any>(serverUrl+'/api/upload', {
    method: "POST",
    headers: {
      'Content-Type': 'multipart/form-data',
      "Authorization" : `Bearer ${localStorage.getItem('access_token')}` 
    },
    data : values?.data
  });
}