import { formatPrice } from "./formatPrice";

const getCurrencySymbol = (currency?: string): string => {
    return formatPrice(0, { currency, fraction: 0 }).replace(/\d/g, "").trim();
};

export { getCurrencySymbol };
