import moment from "moment";

export const enumeateDaysBetweenDates = (startDate, endDate) => {
  const dates = [];
  const currDate = moment(startDate).startOf("day");
  const lastDate = moment(endDate).startOf("day");

  while (currDate.diff(lastDate) <= 0) {
    console.log(currDate.toDate());
    dates.push(currDate.clone().toDate());
    currDate.add(1, "days");
  }
  return dates;
};
