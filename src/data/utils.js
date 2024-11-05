export function displayTimestamp(data) {
  return new Date(data * 1000).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" });
}

export function displayId(id) {
  if (id.startsWith("sha256:")) return id.slice(7, 19);
  return id.slice(0, 12);
}

export function displayArray(data, separator = ", ") {
  return data.join(separator);
}
