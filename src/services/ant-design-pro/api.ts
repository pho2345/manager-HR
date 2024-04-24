import { request, useParams } from '@umijs/max';
import axios from 'axios';
export async function currentUser(options?: { [key: string]: any }) {
  const data = await request<any>(SERVER_URL_ACCOUNT + '/ca-nhan/tai-khoan', {
    method: 'GET',
    ...(options || {}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    
  });

  console.log('data', data);

  if(data?.data){
    return data.data as API.CurrentUser
  }
}

export async function outLogin() {
  // return request<Record<string, any>>('/api/login/outLogin', {
  //   method: 'POST',
  //   ...(options || {}),
  // });
  localStorage.removeItem('access_token')
  localStorage.removeItem('user');
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>(SERVER_URL_ACCOUNT + '/dang-nhap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*'
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

// export async function customAPIDowloadPDF(collection?: string, id?: number) {
//   const data = await axios(`${SERVERURL}/api/${collection}${id ? `/${id}` : ``}`, {
//     headers: {
//       'Content-Type': 'application/xml',
//       Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//     },
//   });

//   if (data.status === 200) {
//     const xmlContent = data?.data?.file;
//     const name = data?.data?.name;

//     // Create a hidden div element to hold the XML content
//     const xmlContainer = document.createElement('div');
//     xmlContainer.innerHTML = xmlContent;

//     // Convert XML content to HTML string
//     const htmlContent = xmlContainer.innerHTML;

//     // Convert HTML to PDF using html2pdf
//     html2pdf().set({ html2canvas: { scale: 2 } }).from(htmlContent).save(`${name}${moment().format('HH:mm DD/MM/YYYY')}` + '.pdf');
//   } else {
//     // Handle error
//   }
// }


export async function get(url: string, params = {}) {
  console.log('params', params)
  const fetchData = await request<any>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: params
  });


  return {
    total: fetchData && fetchData?.length,
    success: fetchData && true,
    data: fetchData
  }
}

export async function getCustome(url: string) {
  const fetchData = await request<any>(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  return {
    total: fetchData && fetchData?.length,
    success: fetchData && true,
    data: fetchData
  }
}

export async function post(url: string, values: object, body: object) {
  const fetchData = await request<any>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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

export async function post2(subSolder: string, values: object, body: []) {
  const fetchData = await request<any>(SERVERURL + subSolder, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    params: {
      ...values,
    },
    data: body,
  });
  return {
    total: fetchData?.meta?.pagination?.total,
    success: fetchData.data && true,
    data: fetchData.data
  }
}


export async function patch(subSolder: string, body: object) {
  const fetchData = await request<any>(subSolder, {
    method: 'patch',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    
    data: {
      ...body,
    },
  });
  return fetchData
}

export async function deletes(subSolder: string) {
  const fetchData = await request<any>(subSolder, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  return {
    total: fetchData?.meta?.pagination?.total,
    success: fetchData.data && true,
    data: fetchData.data
  }
}

export async function put(subSolder: string, body: object, params  : object = {}) {
  const fetchData = await request<any>(subSolder, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    },
    
    data: body,
    params: params
  });
  return fetchData
}


