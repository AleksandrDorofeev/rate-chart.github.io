import { format } from "date-fns";

export const formatDate = (date) => {
  return format(date, "yyyy-MM-dd");
};

export const formatRateTime = (rate) => {
  return format(new Date(rate["date"]), "dd.MM")
};
