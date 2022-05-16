function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export { encodeBase64 };
