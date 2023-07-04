export function generateRandomId(length) {
    const characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    let id = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * characters.length);
      id += characters.charAt(idx);
    }
    return id;
  }