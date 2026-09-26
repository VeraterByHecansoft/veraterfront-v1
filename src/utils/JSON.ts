function safeJsonParse<T = any>(str: string): T | null {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
}

export { safeJsonParse };
