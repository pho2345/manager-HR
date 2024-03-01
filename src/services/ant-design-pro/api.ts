import { request } from '@umijs/max';
import axios from 'axios';
import moment from 'moment';


const dataTest = {
  "status_code": 200,
  "message": "THANH_CONG",
  "data": {
      "hovaten": "Vien Chuc Test 242024",
      "gioiTinh": "Nam",
      "cacTenGoiKhac": "Aniya",
      "sinhNgay": "2001-12-17T07:51:56",
      "noiSinh": "6838 Stanton Flats Suite 260",
      "queQuan": "0999 Emelia Corners Suite 096",
      "danToc": "Khơ Lơ",
      "soCCCD": "000100200400",
      "ngayCapCCCD": "2013-05-09T16:35:34",
      "soDienThoai": "914611746310",
      "soBHXH": "8560349374",
      "soBHYT": "65iovkef",
      "noiOHienNay": "5465 Floy Squares",
      "thanhPhanGiaDinh": "Tư sản",
      "ngheNghiepTruocKhiTuyenDung": "Rerum et sunt.",
      "ngayDuocTuyenDungLanDau": "2016-06-22T18:07:13",
      "coQuanToChucDonViTuyenDung": "",
      "ngayVaoCoQuanHienDangCongTac": "1973-08-16T20:20:13",
      "ngayVaoDangCongSanVietNam": "1995-02-13T07:40:41",
      "ngayChinhThuc": "1978-07-08T01:50:45",
      "ngayThamGiaToChucChinhTriXaHoiDauTien": "2022-04-11T00:31:24",
      "ngayNhapNgu": "2021-01-20T11:38:19",
      "ngayXuatNgu": "1998-10-06T21:47:49",
      "capBacLoaiQuanHamQuanDoi": "Trung sĩ",
      "doiTuongChinhSach": "Con liệt sĩ",
      "trinhDoGiaoDucPhoThong": "10/10",
      "trinhDoChuyenMon": "Thạc sĩ",
      "hocHam": "Phó giáo sư",
      "danhHieuNhaNuocPhongTang": "Tỉnh Anh hùng",
      "chucVuHienTai": "Rodriguez",
      "ngayBoNhiem": "1988-02-28T10:43:51",
      "ngayBoNhiemLai": "2018-03-04T14:06:48",
      "duocQuyHoacChucDanh": "Quo ut et et.",
      "chucVuKiemNhiem": "Runolfsdottir",
      "chucVuDangHienTai": "Bauch",
      "chucVuDangKiemNhiem": "Gusikowski",
      "congVienChinhDuocGiao": "Sunt consequuntur quisquam.",
      "soTruongCongTac": "Nemo modi animi.",
      "congViecLamLauNhat": "Consequatur eaque at ut magni provident.",
      "tienLuong": 2,
      "ngachNgheNghiep": "jnxdfgagqrz",
      "maSoNgachNgheNghiep": "inzqjx",
      "ngayBoNhiemNgachNgheNghiep": "2004-02-22T15:30:44",
      "bacLuong": "Bậc 10",
      "heSoLuongNgachNgheNghiep": 4.38739,
      "ngayHuongLuongNgachNgheNghiep": "1975-05-05T02:32:02",
      "phanTramHuongLuongNgachNgheNghiep": 6.35192901,
      "phuCapThamNienVuotKhungNgachNgheNghiep": 6.59058,
      "ngayHuongPCTNVKNgachNgheNghiep": "1978-05-04T01:53:07",
      "phuCapChucVu": 3.91774,
      "phuCapKiemNhiem": 7.05684,
      "phuCapKhac": 6.55831,
      "viTriViecLam": "urkkfxpwb",
      "maSoViTriViecLam": "589976",
      "bacLuongTriViecLam": 2,
      "luongTheoMucTien": 2465.5021581587,
      "ngayHuongLuongTheoViTriViecLam": "1987-04-10T22:14:31",
      "phamTramHuongLuong": 7788.9725303231,
      "phuCapThamNienVuotKhung": 6.70889,
      "ngayHuongPCTNVK": "1972-12-31T16:39:19",
      "tinhTrangSucKhoe": "YẾU",
      "chieuCao": 178.243,
      "canNang": 113.597,
      "nhomMau": "AB"
  },
  "time_stamp": "2024-02-06T14:56:29.0716076"
}

export async function currentUser(options?: { [key: string]: any }) {
  const data = await request<any>(SERVERURL + '/ca-nhan/tai-khoan', {
    method: 'GET',
    ...(options || {}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

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
  return request<API.LoginResult>(SERVERURL + '/dang-nhap', {
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


export async function get(collection: string) {
  const fetchData = await request<API.List>(SERVERURL + collection, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });


  return {
    total: fetchData?.data && fetchData?.data?.length,
    success: fetchData.data && true,
    data: fetchData.data
  }
}

export async function getCustome(collection: string) {
  const fetchData = await request<any>(SERVERURL + collection, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });

  return {
    total: fetchData?.data && fetchData?.data?.length,
    success: fetchData.data && true,
    data: fetchData.data
  }
}

export async function post(subSolder: string, values: object, body: object) {
  const fetchData = await request<any>(SERVERURL + subSolder, {
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

