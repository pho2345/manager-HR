
import { request } from '@umijs/max';


export async function updatePet(body: API.Pet, options?: { [key: string]: any }) {
  return request<any>('/pet', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function addPet(body: API.Pet, options?: { [key: string]: any }) {
  return request<any>('/pet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}


export async function getPetById(
  
  params: API.getPetByIdParams,
  options?: { [key: string]: any },
) {
  const { petId: param0, ...queryParams } = params;
  return request<API.Pet>(`/pet/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** Updates a pet in the store with form data POST /pet/${param0} */
export async function updatePetWithForm(
 
  params: API.updatePetWithFormParams,
  body: { name?: string; status?: string },
  options?: { [key: string]: any },
) {
  const { petId: param0, ...queryParams } = params;
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<any>(`/pet/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    data: formData,
    ...(options || {}),
  });
}


export async function deletePet(

  params: API.deletePetParams & {
    // header
    api_key?: string;
  },
  options?: { [key: string]: any },
) {
  const { petId: param0, ...queryParams } = params;
  return request<any>(`/pet/${param0}`, {
    method: 'DELETE',
    headers: {},
    params: { ...queryParams },
    ...(options || {}),
  });
}


export async function uploadFile(
 
  params: API.uploadFileParams,
  body: { additionalMetadata?: string; file?: string },
  file?: File,
  options?: { [key: string]: any },
) {
  const { petId: param0, ...queryParams } = params;
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<API.ApiResponse>(`/pet/${param0}/uploadImage`, {
    method: 'POST',
    params: { ...queryParams },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}


export async function findPetsByStatus(
 
  params: API.findPetsByStatusParams,
  options?: { [key: string]: any },
) {
  return request<API.Pet[]>('/pet/findByStatus', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function findPetsByTags(
  
  params: API.findPetsByTagsParams,
  options?: { [key: string]: any },
) {
  return request<API.Pet[]>('/pet/findByTags', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
