import get from "lodash/get";

const currencySymbolMap: Record<string, string> = { AED: 'د.إ', AFN: '؋', ALL: 'L', AMD: '֏', ANG: 'ƒ', AOA: 'Kz', ARS: '$', AUD: '$', AWG: 'ƒ', AZN: '₼', BAM: 'KM', BBD: '$', BDT: '৳', BGN: 'лв', BHD: '.د.ب', BIF: 'FBu', BMD: '$', BND: '$', BOB: '$b', BOV: 'BOV', BRL: 'R$', BSD: '$', BTC: '₿', BTN: 'Nu.', BWP: 'P', BYN: 'Br', BYR: 'Br', BZD: 'BZ$', CAD: '$', CDF: 'FC', CHE: 'CHE', CHF: 'CHF', CHW: 'CHW', CLF: 'CLF', CLP: '$', CNH: '¥', CNY: '¥', COP: '$', COU: 'COU', CRC: '₡', CUC: '$', CUP: '₱', CVE: '$', CZK: 'Kč', DJF: 'Fdj', DKK: 'kr', DOP: 'RD$', DZD: 'دج', EEK: 'kr', EGP: '£', ERN: 'Nfk', ETB: 'Br', ETH: 'Ξ', EUR: '€', FJD: '$', FKP: '£', GBP: '£', GEL: '₾', GGP: '£', GHC: '₵', GHS: 'GH₵', GIP: '£', GMD: 'D', GNF: 'FG', GTQ: 'Q', GYD: '$', HKD: '$', HNL: 'L', HRK: 'kn', HTG: 'G', HUF: 'Ft', IDR: 'Rp', ILS: '₪', IMP: '£', INR: '₹', IQD: 'ع.د', IRR: '﷼', ISK: 'kr', JEP: '£', JMD: 'J$', JOD: 'JD', JPY: '¥', KES: 'KSh', KGS: 'лв', KHR: '៛', KMF: 'CF', KPW: '₩', KRW: '₩', KWD: 'KD', KYD: '$', KZT: '₸', LAK: '₭', LBP: '£', LKR: '₨', LRD: '$', LSL: 'M', LTC: 'Ł', LTL: 'Lt', LVL: 'Ls', LYD: 'LD', MAD: 'MAD', MDL: 'lei', MGA: 'Ar', MKD: 'ден', MMK: 'K', MNT: '₮', MOP: 'MOP$', MRO: 'UM', MRU: 'UM', MUR: '₨', MVR: 'Rf', MWK: 'MK', MXN: '$', MXV: 'MXV', MYR: 'RM', MZN: 'MT', NAD: '$', NGN: '₦', NIO: 'C$', NOK: 'kr', NPR: '₨', NZD: '$', OMR: '﷼', PAB: 'B/.', PEN: 'S/.', PGK: 'K', PHP: '₱', PKR: '₨', PLN: 'zł', PYG: 'Gs', QAR: '﷼', RMB: '￥', RON: 'lei', RSD: 'Дин.', RUB: '₽', RWF: 'R₣', SAR: '﷼', SBD: '$', SCR: '₨', SDG: 'ج.س.', SEK: 'kr', SGD: 'S$', SHP: '£', SLL: 'Le', SOS: 'S', SRD: '$', SSP: '£', STD: 'Db', STN: 'Db', SVC: '$', SYP: '£', SZL: 'E', THB: '฿', TJS: 'SM', TMT: 'T', TND: 'د.ت', TOP: 'T$', TRL: '₤', TRY: '₺', TTD: 'TT$', TVD: '$', TWD: 'NT$', TZS: 'TSh', UAH: '₴', UGX: 'USh', USD: '$', UYI: 'UYI', UYU: '$U', UYW: 'UYW', UZS: 'лв', VEF: 'Bs', VES: 'Bs.S', VND: '₫', VUV: 'VT', WST: 'WS$', XAF: 'FCFA', XBT: 'Ƀ', XCD: '$', XOF: 'CFA', XPF: '₣', XSU: 'Sucre', XUA: 'XUA', YER: '﷼', ZAR: 'R', ZMW: 'ZK', ZWD: 'Z$', ZWL: '$' };

const getSymbolFromCurrency = (currencyCode?: string): string => {
    if (!currencyCode) {
        currencyCode = "USD";
    }

    return get(currencySymbolMap, [currencyCode.toUpperCase()]);
};

export {  getSymbolFromCurrency };
