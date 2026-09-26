import secureStore from "@/contexts/store/persistConfig";

const getData = (key: string): unknown | undefined => {
  try {
    const data = secureStore.getItem(key)

    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Read from local storage', error);
  }
};

const setData = (key: string, value: unknown): void => {
  try {
    secureStore.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Save in local storage', error);
  }
};

export { getData, setData };
