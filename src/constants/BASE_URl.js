// constants.js ya kisi bhi common file me define karein
export const BASE_URL = 'https://www.makeahabit.com/api/v1/uploads/';

export const http2 = {
  category: BASE_URL + 'category/',
  product: BASE_URL + 'products/',
  service: BASE_URL + 'services/',
  icon: BASE_URL + 'icon/',
  staff: BASE_URL + 'staff/',
  business: BASE_URL + 'business/',
  banner: BASE_URL + 'banner/',
  gallery: BASE_URL + 'galary/',
  profile: BASE_URL + 'profile/',
};

// Helper function
export const getImageUri = (type, fileName) => {
  return fileName
    ? http2[type] + fileName
    : 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png';
};
