import localforage from 'localforage';

// To instanser: en for appens struktur (fag/mapper/sider/widgets), en for bilde-blobs.
const appDataStore = localforage.createInstance({
  name: 'vikaoppstart',
  storeName: 'appData',
});

const imageStore = localforage.createInstance({
  name: 'vikaoppstart',
  storeName: 'images',
});

const SUBJECTS_KEY = 'subjects';

export async function loadSubjects() {
  const data = await appDataStore.getItem(SUBJECTS_KEY);
  return data ?? [];
}

export async function saveSubjects(subjects) {
  return appDataStore.setItem(SUBJECTS_KEY, subjects);
}

export async function saveImage(imageId, blob) {
  return imageStore.setItem(imageId, blob);
}

export async function getImage(imageId) {
  return imageStore.getItem(imageId);
}

export async function deleteImage(imageId) {
  return imageStore.removeItem(imageId);
}
