/* encodeURI */
import { API_ROOT } from './const';

async function getAddon(slug) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_ROOT}/addons/addon/${encodeURI(slug)}/?lang=en-US`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    })
  });
  checkStatus(response);
  return parseJSON(response);
}

async function getCategories(slug) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_ROOT}/addons/categories/?lang=en-US`, {
    headers: new Headers({
      'Content-Type': 'application/json',
    })
  });
  checkStatus(response);
  return parseJSON(response);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json()
}

const Client = { checkStatus, getAddon, getCategories };
export default Client;
