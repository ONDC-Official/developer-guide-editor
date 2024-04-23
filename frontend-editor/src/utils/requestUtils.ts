import axios from "axios";

const baseURL = "http://localhost:1000/guide";

export async function getData(params: any) {
  console.log("body", params);
  try {
    const response = await axios.get(baseURL, { params: params });
    return response.data;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(
      error?.message ||
        error.response.data ||
        error.response.statusText ||
        error.response.status ||
        "Error while fetching data"
    );
  }
}

export async function postData(params: any, data: any) {
  try {
    const response = await axios.post(baseURL, data, { params: params });
    return response.data;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(
      error?.message ||
        error.response.data ||
        error.response.statusText ||
        error.response.status ||
        "Error Adding Data"
    );
  }
}

export async function deleteData(params: any) {
  try {
    const response = await axios.delete(baseURL, { params: params });
    return response.data;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(
      error?.message ||
        error.response.data ||
        error.response.statusText ||
        error.response.status ||
        "Error Deleting Data"
    );
  }
}
