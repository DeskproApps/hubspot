import { LOCALE } from "../../constants";
import type { DateTime } from "../../types";

type Options = {
  date?: boolean;
  time?: boolean;
};

const dateOptions: Pick<Intl.DateTimeFormatOptions, "day"|"month"|"year"> = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};
const timeOptions: Pick<Intl.DateTimeFormatOptions, "hour"|"minute"> = {
  hour: "2-digit",
  minute: "2-digit",
};

const format = (
  rawDate: DateTime|undefined,
  options: Options = {},
): string|undefined => {
  if (!rawDate || typeof rawDate !== "string") {
    return;
  }

  const { date = true, time = false } = options;

  try {
    return (new Intl.DateTimeFormat(LOCALE, {
      ...(!date ? {} : dateOptions),
      ...(!time ? {} : timeOptions),
    })).format(new Date(rawDate));
  } catch (e) {
    return;
  }
};

export { format };
