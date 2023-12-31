export const convertNumberToVND = (price) => {
  return Number(price).toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
};
export const convertNumberToVNDPayment = (price) => {
  return Number(price.toString().replace(/00$/, "")).toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
};

