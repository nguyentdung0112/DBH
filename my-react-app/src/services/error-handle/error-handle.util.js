export const errorHandleUtil = (message, toast) => {
  // message co the la 1 [] hoac la 1 chuoi
  if (Array.isArray(message)) {
    for (let index = 0; index < message.length; index++) {
      toast.error(message[index]);
    }
  }

  toast.error(message);
};
