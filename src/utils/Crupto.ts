import {MD5} from 'crypto-js';

export function hashMD5(deps: any) {

  return MD5(JSON.stringify(deps, Object.keys(deps as any).sort())).toString()
}
