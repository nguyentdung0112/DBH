import moment from "moment";

export const calDate = (startDate, endDate) => {
    const now = moment(startDate); //todays date
    const end = moment(endDate); // another date
    const duration = moment.duration(end.diff(now));
    return duration.asDays();
}