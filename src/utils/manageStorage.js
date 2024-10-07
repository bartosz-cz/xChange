export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function download(key) {
  const savedData = localStorage.getItem(key);
  return JSON.parse(savedData);
}
