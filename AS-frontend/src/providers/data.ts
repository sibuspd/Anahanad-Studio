
import { BACKEND_BASE_URL } from "@/constants"
import { ListResponse, CreateResponse, GetOneResponse, } from "@/types";
import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest"
import { HttpError } from "@refinedev/core"

if (!BACKEND_BASE_URL){
  throw new Error('BACKEND_BASE_URL is not configured in .env file');
}

/**SHARED ERROR BUILDER */
const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed.';

  try{
    const payload = (await response.json()) as { message?: string, error?: string };

    if(payload?.message) message = payload.message;
    if(payload?.error) message = payload.error;
  } catch{
    // Ignore errors
  }

  return {
    message,
    statusCode: response.status,
  };
};


  const resolveResource = (resource: string) => {
    switch (resource){
      case "classes":
        return "class-sessions";
      default:
        return resource;
    } 
  }

/**  DATA PROVIDER OPTIONS */
const options: CreateDataProviderOptions = {
  // >> OPTION 1: SIMPLE REST DATA PROVIDER
  getList: {
    getEndpoint: ({ resource } ) => {
      switch(resource){
        case "classes":
          return "class-sessions";
        default:
          return resolveResource(resource);
      }
    },

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
        const field = String('field' in filter? filter.field : '');
        const value = String(filter.value); // Convert value to string
        
      switch(resource){ // resource corresponds to the side nav bar selected
        /** SUBJECTS */
        case 'subjects':
          if(field === 'department') params.department = value; // If query param field is department, set the value to the department selected
          if(field === 'name' || field === 'code') params.search = value; // If query param field is name or code, set the value to the search query
          break;
        
        /** COURSES */
        case 'courses':
          if(field === 'subjectId') params.subjectId = value;
          if(field === 'level') params.level = value;
          if(field === 'name') params.search = value;
          break;

        /** BATCHES */
        case 'batches':
          if(field === 'name') params.search = value;
          break;
          
        /** USERS */
        case 'users':
          if(field === 'role') params.role = value;
          if(field === 'emailVerified') params.emailVerified = value;
          if(field === 'name' || field === 'email') params.search = value;
          break;

        /** CLASS SESSIONS */
        case 'classes':
          if(field === 'courseId') params.courseId = value;
          if(field === 'batchId') params.batchId = value;
          if(field === 'teacherId') params.teacherId = value;
          if(field === 'status') params.status = value;
          if(field === 'name') params.search = value;
          break;
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

  // >> OPTION 2: CUSTOM DATA PROVIDER FOR CREATING DATA
  create: {
    getEndpoint: ( {resource} ) => resource, // Returns the resource that is passed from the side nav bar
    
    buildBodyParams: async ( {variables} ) => variables, // Returns the variables that are passed from the form

    mapResponse: async ( response ) => { // Returns the response from the backend
      if(!response.ok) throw await buildHttpError(response); 
      const json: CreateResponse = await response.json();
      return json.data ?? [];
    }
  },

  /** >> OPTION 3: DATA PROVIDER FOR GETTING DATA OF SPECIFIC ID*/
  getOne: {
    getEndpoint: ( { resource, id }) => `${resource}/${id}`, // Returns the resource and id that are passed
    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);
      const json: GetOneResponse = await response.json();
      return json.data ?? [];
    }
  },

  /** >> OPTION 4: DATA PROVIDER FOR UPDATING DATA*/
  update: {
    getEndpoint: ( {resource, id}) => `${resource}/${id}`,
    buildBodyParams: async ( {variables} ) => variables,
    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);
      const json: CreateResponse = await response.json();
      return json.data ?? [];
    },
  },

  /** >> OPTION 5: DATA PROVIDER FOR DELETING DATA */
  deleteOne: {
    getEndpoint: ( { resource, id }) => `${resource}/${id}`,
    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);
      const json: CreateResponse = await response.json();
      return json.data ?? [];
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };