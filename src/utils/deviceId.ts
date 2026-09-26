// utils/deviceId.ts
import secureStore from "@/contexts/store/persistConfig";

const DEVICE_ID_KEY = 'DEVICE_UNIQUE_ID';

export async function getDeviceId(): Promise<string> {
  // let deviceId = await secureStore.getItem(DEVICE_ID_KEY);
  // if (deviceId  ===  null) {
  //   deviceId = generateUUID(); // Genera un UUID
  //   await secureStore.setItem(DEVICE_ID_KEY, deviceId);
  // }
  const deviceId = generateFingerprint()
  return deviceId;
}

function generateFingerprint(): string {
  const navigatorInfo = window.navigator;
  const screenInfo = window.screen;
  
  // Recolectamos datos clave
  const data = [
    navigatorInfo.userAgent,
    navigatorInfo.language,
    screenInfo.colorDepth,
    screenInfo.width,
    screenInfo.height,
    screenInfo.availWidth,
    screenInfo.availHeight,
    new Date().getTimezoneOffset(),
    navigatorInfo.hardwareConcurrency, // núcleos CPU
  ].join('###');


  function hashCode(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  }

  return hashCode(data);
}
