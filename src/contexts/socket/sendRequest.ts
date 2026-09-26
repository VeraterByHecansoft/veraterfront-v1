

export interface SocketReqType {
  type: string;
  params: any;
}

export const sendRequest = (req: SocketReqType, socket: any) => {
  const { type = 'PING', params = {} } = req;

  if (socket) {
    const request = {
      t: type,
      apiv: import.meta.env.VITE_APIV,
      h: import.meta.env.VITE_HOST_NAME,
      d: {
        ...params,
      }
    }
    socket.send(JSON.stringify(request));
  } else {
  }
};