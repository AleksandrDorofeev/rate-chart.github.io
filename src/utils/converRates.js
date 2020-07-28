import { formatRateTime } from "./formatDate";

export const convertRates = (rates) => {
  switch (rates.base) {
    case "USD":
      return {
        time: formatRateTime(rates),
        USD: rates["rates"].RUB,
      };
    case "EUR":
      return {
        time: formatRateTime(rates),
        EUR: rates["rates"].RUB,
      };
    default:
      return 0;
  }
};