export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41732117-59258c5357db5fde0d38d4929';

export const options = {
  params: {
    key: API_KEY,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};
