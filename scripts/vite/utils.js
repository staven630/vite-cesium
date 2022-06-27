// 解析env变量
export function parseEnv(env) {
  return Object.entries(env).reduce((acc, curr) => {
    const [key, value] = curr;
    if (value == 'true' || value == 'false') acc[key] = value == 'true';
    else if (/^\d+$/.test(value)) acc[key] = Number(value)
    else if (value == 'null') acc[key] = null
    else if (value == 'undefined') acc[key] = undefined
    else acc[key] = value;
    return acc;
  }, {});
}

const httpsReg = /^https:\/\//;

export function parseProxy(value, baseUrl = '') {
  if (!/\[\[(.*)\]\]/.test(value)) return {};
  let list = [];

  list = value.replace(/\[|\]|'|"/g, '').split(',');

  let proxyList = [];

  for (let i = 0; i < list.length; i = i + 2) {
    proxyList.push([list[i].trim(), list[i + 1].trim()]);
  }

  return proxyList.reduce((acc, curr) => {
    const [prefix, target] = curr;
    const isHttps = httpsReg.test(target);

    const finalPrefix = `${baseUrl}${prefix}`.replace("//", '');

    let params = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: (api) => api.replace(new RegExp(`^${finalPrefix}`), ''),
      secure: true
    }

    isHttps &&  (params.secure = false);

    acc[finalPrefix] = params;
    return acc;
  }, {});
}
