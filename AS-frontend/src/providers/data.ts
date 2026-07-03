// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

// import { DataProvider, BaseRecord, GetListParams, GetListResponse} from "@refinedev/core";

// import { MOCK_SUBJECTS } from "@/constants/mock-data";

// export const dataProvider: DataProvider = {
//   getList: async <TData extends BaseRecord = BaseRecord>({
//     resource
//   }: GetListParams): Promise<GetListResponse<TData>> => {
//     if (resource !== 'subjects') return { data: [] as TData[], total: 0 };

//     return {
//         data: MOCK_SUBJECTS as unknown as TData[],
//         total: MOCK_SUBJECTS.length,
//     }
//   },

//   getOne: async () => {
//     throw new Error("This function is not present in mock");
//   },
//   create: async () => {
//     throw new Error("This function is not present in mock");
//   },
//   update: async () => {
//     throw new Error("This function is not present in mock");
//   },
//   deleteOne: async () => {
//     throw new Error("This function is not present in mock");
//   },

//   getApiUrl: () => '',
// };

import { BACKEND_BASE_URL } from "@/constants"
import { ListResponse } from "@/types";
import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest"

if (!BACKEND_BASE_URL){
  throw new Error('BACKEND_BASE_URL is not configured in .env file');
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed.';

  try{
    const payload = (await response.json()) as { message?: string}

    if(payload?.message) message = payload.message;
  } catch{
    // Ignore errors
  }

  return {
    message,
    statusCode: response.status,
  }
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource } ) => resource,

    // Below is the default implementation of a function that returns the params to be sent to the backend
    buildQueryParams: async ( { resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1; // pagination decides which page to fetch
      const pageSize = pagination?.pageSize ?? 10; // pageSize decides how many items to fetch per page

      // defined params to be sent to the backend
      const params: Record<string, string | number> = {
        page, 
        limit: pageSize
      };

      filters?.forEach( (filter) => {
        const field = 'field' in filter? filter.field : '';
        const value = String(filter.value); // Convert value to string
        
        // resource corresponds to the side nav bar selected
        if(resource === 'subjects'){
          if(field === 'department') params.department = value;
          if(field === 'name'|| field === 'code') params.search = value;
        }
      });

      return params;
    },  
    
    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },

    getTotalCount: async ( response ) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0; 
    }
  },

  create: {
    getEndPoint: ( {resource} ) => resource, // Returns the resource that is passed from the side nav bar
    
    buildBodyParams: async ( {variables} ) => variables, // Returns the variables that are passed from the form

    mapResponse: async ( response ) => { // Returns the response from the backend
      const json: CreateResponse = await response.json();
      return json.data ?? [];
    }
  }
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider};