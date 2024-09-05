import axios from "axios";
import { get } from "react-hook-form";
import { getDecryptedCookie } from "./cookieUtils";

const backURL = import.meta.env.VITE_BACKEND;
const baseURL = `${backURL}/tree/guide`;
export async function getData(path: string, query = {}, providedUrl?: string) {
  try {
    console.log("getting data from", path);
    const token = getDecryptedCookie();
    const url = providedUrl ? providedUrl : `${baseURL}/${path}`;
    const response = await axios.get(url, {
      params: query,
      headers: { "x-api-key": token },
    });
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

export async function postData(path: string, data: any, providedUrl?: string) {
  try {
    const url = providedUrl ? providedUrl : `${baseURL}/${path}`;
    const userName = localStorage.getItem("username");
    const token = getDecryptedCookie();

    const response = await axios.post(url, data, {
      headers: { "x-api-key": token, "x-user": userName },
    });
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

export async function patchData(path: string, data: Record<string, any>) {
  try {
    const url = `${baseURL}/${path}`;
    const userName = localStorage.getItem("username");
    const token = getDecryptedCookie();
    const response = await axios.patch(url, data, {
      headers: { "x-api-key": token, "x-user": userName },
    });
    return response.data;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(
      error?.message ||
        error.response.data ||
        error.response.statusText ||
        error.response.status ||
        "Error Updating Data"
    );
  }
}

export async function deleteData(path: string, query = {}) {
  console.log("query", query);
  try {
    const url = `${baseURL}/${path}`;
    const userName = localStorage.getItem("username");
    const token = getDecryptedCookie();
    const response = await axios.delete(url, {
      params: query,
      headers: { "x-api-key": token, "x-user": userName },
    });
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

export async function UndoData(path: string) {
  try {
    const url = `${baseURL}/${path}`;
    const userName = localStorage.getItem("username");
    const token = getDecryptedCookie();
    const response = await axios.put(
      url,
      {},
      {
        params: {
          type: "undo",
        },
        headers: { "x-api-key": token, "x-user": userName },
      }
    );
    return response.data;
  } catch (e: any) {
    console.log("error", e);
    throw new Error(
      e?.message ||
        e.response.data ||
        e.response.statusText ||
        e.response.status ||
        "Error Undoing Data"
    );
  }
}

export async function sendBuildRequest() {
  try {
    console.log("sending build request");
    const userName = localStorage.getItem("username");
    const token = getDecryptedCookie();
    const url = `${baseURL}/tree/build`;
    const response = await axios.post(url);
    return response.data;
  } catch (error: any) {
    console.log("error", error);
    throw new Error(
      error?.message ||
        error.response.data ||
        error.response.statusText ||
        error.response.status ||
        "Error Building Guide"
    );
  }
}
