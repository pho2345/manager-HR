import { request } from '@umijs/max';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import moment from 'moment';

export async function currentUser(options?: { [key: string]: any }) {
  // const data = await request<API.CurrentUser>(SERVERURL + '/api/users/me', {
  //   method: 'GET',
  //   ...(options || {}),
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //   },
  // });

  const abc: API.CurrentUser = {
    id: '1',
    username: 'pho',
    email: 'a@gmail.com',
    fullname: "123",
    avatar: "123",
    phone: "122",
  }

  return new Promise((res) => {
    return res(abc)
  })
}

export async function outLogin() {
  // return request<Record<string, any>>('/api/login/outLogin', {
  //   method: 'POST',
  //   ...(options || {}),
  // });
  localStorage.setItem('access_token', '');
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>(SERVERURL + '/api/users/login-admin', {
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
  const fetchData = await request<any>(SERVERURL + '/api/' + collection, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: {
      ...values,
    },
  });


  return {
    data: fetchData.data ? fetchData.data : fetchData,
    success: true,
    total: fetchData?.meta?.pagination?.total,
  };
}

export async function customAPIPost(
  values?: { [key: string]: any },
  collection?: string,
  body?: any,
) {
  const fetchData = await request<any>(SERVERURL + '/api/' + collection, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: {
      ...values,
    },
    data: {
      ...body,
    },
  });

  return {
    data: fetchData.data ? fetchData.data : fetchData,
    success: true,
    total: fetchData?.meta?.pagination?.total,
  };
}

export async function customAPIAdd(values?: { [key: string]: any }, collection?: string) {
  return request<any>(SERVERURL + '/api/' + collection, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    data: {
      data: values,
    },
  });
}

export async function customAPIUpdate(
  values?: { [key: string]: any },
  collection?: string,
  id?: any,
) {
  return request<any>(SERVERURL + '/api/' + collection + `/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    data: {
      data: values,
    },
  });
}

export async function customAPIDelete(values?: { [key: string]: any }, collection?: string) {
  return request<any>(SERVERURL + '/api/' + collection + '/' + values, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
}

export async function customAPIGetOne(
  values?: any,
  collection?: string,
  params?: { [key: string]: any },
) {
  return request<any>(SERVERURL + '/api/' + collection + '/' + values, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: {
      ...params,
    },
  });
}

export async function customAPIPostOne(
  values?: any,
  collection?: string,
  params?: { [key: string]: any },
) {
  return request<any>(SERVERURL + '/api/' + collection + '/' + values, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: {
      ...params,
    },
  });
}

export async function customAPIUpload(values?: { [key: string]: any }) {

  return request<any>(SERVERURL + '/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    data: values?.data,
  });
}

export async function customAPIUpdateMany(values?: any, collection?: string, id?: any) {
  return request<any>(`${SERVERURL}/api/${collection}${id ? `/${id}` : ''}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    data: {
      ...values,
    },
  });
}

export async function customAPIGetFile(types?: string, collection?: string) {
  const data = await fetch(SERVERURL + '/api/' + collection, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (data.status === 200) {
    const blob = await data.blob();
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = types === 'code' ? 'input_weight_code.xlsx' : 'input_weight_c_pass.xlsx';

    // Programmatically trigger the download
    anchor.click();

    // Clean up the temporary anchor
    URL.revokeObjectURL(anchor.href);
  } else {
  }
}

export async function customAPIUpdateFile(values?: any, collection?: string) {
  let data = new FormData();
  data.append('file', values.upload[0].originFileObj);
  let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${SERVERURL}/api/${collection}`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    data: data,
  };

  await axios.request(config);
}


export async function customAPIGetFileSlotChart(
  types?: string,
  collection?: string,
  value?: number,
) {
  const data = await axios(`${SERVERURL}/api/${collection}${value ? `/${value}` : ''}`, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (data.status === 200) {
    const dataFile = Buffer.from(data?.data?.file);
    const name = data?.data?.name;

    // Create a blob from the buffer
    const blob = new Blob([dataFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = name + '.xlsx';

    // Trigger the download
    downloadLink.click();

    // const anchor = document.createElement('a');
    // anchor.href = URL.createObjectURL(blob);
    // anchor.download = 'pho.xlsx';
    // anchor.click();
    // URL.revokeObjectURL(anchor.href);
  } else {
  }
}

export async function customAPIDowload(
  collection?: string,
  id?: any,
  values?: { [key: string]: any }
) {
  const data = await axios(`${SERVERURL}/api/${collection}${id ? `/${id}` : ``}`, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: {
      ...values,
    },
  });

  if (data.status === 200) {
    const dataFile = Buffer.from(data?.data?.file);
    const name = data?.data?.name;

    // Create a blob from the buffer
    const blob = new Blob([dataFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = name + '.xlsx';

    // Trigger the download
    downloadLink.click();

    // const anchor = document.createElement('a');
    // anchor.href = URL.createObjectURL(blob);
    // anchor.download = 'pho.xlsx';
    // anchor.click();
    // URL.revokeObjectURL(anchor.href);
  } else {
  }
}

export async function customAPIDowloadPDF(collection?: string, id?: number) {
  const data = await axios(`${SERVERURL}/api/${collection}${id ? `/${id}` : ``}`, {
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  if (data.status === 200) {
    const xmlContent = data?.data?.file;
    const name = data?.data?.name;

    // Create a hidden div element to hold the XML content
    const xmlContainer = document.createElement('div');
    xmlContainer.innerHTML = xmlContent;

    // Convert XML content to HTML string
    const htmlContent = xmlContainer.innerHTML;

    // Convert HTML to PDF using html2pdf
    html2pdf().set({ html2canvas: { scale: 2 } }).from(htmlContent).save(`${name}${moment().format('HH:mm DD/MM/YYYY')}` + '.pdf');
  } else {
    // Handle error
  }
}


export async function get(collection: string) {
  const fetchData = await request<API.List>(SERVERURL + collection, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });


  return {
    total: fetchData?.data && fetchData?.data?.length,
    success: fetchData.data && true,
    data: fetchData.data
  }
}

export async function post(collection: string, values: object, body: object) {
  const fetchData = await request<any>(SERVERURL + '/api/' + collection, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: {
      ...values,
    },
    data: {
      ...body,
    },
  });
  return {
    total: fetchData?.meta?.pagination?.total,
    success: fetchData.data && true,
    data: fetchData.data
  }
}

