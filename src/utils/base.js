export function getEnvVarible(key) {
  const value = import.meta.env[key];
  if (value == 'true' || value == 'false') return value == 'true';
  if (/^\d+$/.test(value)) return Number(value)
  if (value == 'null') return null
  if (value == 'undefined') return undefined
  return value;
}
