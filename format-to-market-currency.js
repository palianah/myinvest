/**
 * ! This file is a copy of @workbench/core/utils/format-to-market-specific-currency.ts
 * TODO: remove, once workbench util is aligned with market requirements
 */
/**
 * @name formatToMarketSpecificCurrency
 *
 * @description Returns the given number formatted as a price on the given market
 *
 * @example
 * import { formatToMarketSpecificCurrency } from '@workbench/core';
 *
 * const formattedPrice: string = formatToMarketSpecificCurrency(120000, 'it-CH');
 */
export const formatToMarketSpecificCurrency = (value, market, config = SPECIAL_PRICE_FORMAT) => {
  if (!(market in config)) {
    return value.toString();
  }
  const priceFormatConfig = config[market];
  const { currencyFormat = {}, decimalDigitsCount = 0, overrideSeparatorConfig } = priceFormatConfig.priceFormat;
  const { priceCurrencyPrefix = '', priceCurrencySuffix = '' } = currencyFormat;
  const priceNumber = new Intl.NumberFormat(market, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimalDigitsCount,
    maximumFractionDigits: decimalDigitsCount,
  })
    .formatToParts(value)
    .map(({ type, value }) => {
    var _a, _b;
    switch (type) {
      case 'group':
        return (_a = overrideSeparatorConfig === null || overrideSeparatorConfig === void 0 ? void 0 : overrideSeparatorConfig.groupSeparator) !== null && _a !== void 0 ? _a : value;
      case 'decimal':
        return (_b = overrideSeparatorConfig === null || overrideSeparatorConfig === void 0 ? void 0 : overrideSeparatorConfig.decimalSeparator) !== null && _b !== void 0 ? _b : value;
      default:
        return value;
    }
  })
    .reduce((string, part) => string + part)
    .replace(/\s*€\s*/, '')
    .replace(/\s*EUR\s*/, '');
  return `${priceCurrencyPrefix}${priceNumber}${priceCurrencySuffix}`.trim();
};
const SPECIAL_PRICE_FORMAT = {
  'cs-CZ': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' Kč',
      },
    },
  },
  'da-DK': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' kr',
      },
    },
  },
  'de-AT': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '€ ',
      },
      decimalDigitsCount: 2,
    },
  },
  'de-CH': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'CHF ',
        priceCurrencySuffix: '.-',
      },
      overrideSeparatorConfig: {
        groupSeparator: "'",
        decimalSeparator: '.',
      },
    },
  },
  'de-DE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'de-HU': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' Ft',
      },
    },
  },
  'de-LU': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
    },
  },
  'el-CY': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '€',
      },
      decimalDigitsCount: 2,
    },
  },
  'el-GR': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-AE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' USD',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-AU': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'A$ ',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-CH': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'CHF ',
        priceCurrencySuffix: '.-',
      },
      overrideSeparatorConfig: {
        groupSeparator: "'",
        decimalSeparator: '.',
      },
    },
  },
  'en-CN': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' RMB',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-DE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-EG': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'EGP ',
      },
    },
  },
  'en-GB': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '£',
      },
    },
  },
  'en-HK': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'HK$',
      },
    },
  },
  'en-HU': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' Ft',
      },
    },
  },
  'en-IE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
    },
  },
  'en-IN': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '₹ ',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-KR': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' 원',
      },
    },
  },
  'en-MY': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'RM ',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-NZ': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '$',
      },
    },
  },
  'en-SE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' kr',
      },
      decimalDigitsCount: 2,
    },
  },
  'en-SG': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' SGD',
      },
    },
  },
  'en-TH': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'THB ',
      },
    },
  },
  'en-TW': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' 台幣',
      },
    },
  },
  'en-VN': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' ₫',
      },
      overrideSeparatorConfig: {
        groupSeparator: '.',
        decimalSeparator: ',',
      },
    },
  },
  'en-ZA': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'R ',
      },
    },
  },
  'es-AR': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' ARS',
      },
    },
  },
  'es-ES': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'fi-FI': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'fr-BE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
    },
  },
  'fr-CH': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'CHF ',
        priceCurrencySuffix: '.-',
      },
      overrideSeparatorConfig: {
        groupSeparator: "'",
        decimalSeparator: '.',
      },
    },
  },
  'fr-FR': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
    },
  },
  'fr-LU': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
    },
  },
  'hi-IN': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '₹ ',
      },
    },
  },
  'hu-HU': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' Ft',
      },
    },
  },
  'it-CH': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'CHF ',
        priceCurrencySuffix: '.-',
      },
      overrideSeparatorConfig: {
        groupSeparator: "'",
        decimalSeparator: '.',
      },
    },
  },
  'it-IT': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'ja-JP': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' 円',
      },
      decimalDigitsCount: 2,
    },
  },
  'ko-KR': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' 원',
      },
    },
  },
  'nl-BE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
    },
  },
  'nl-NL': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '€ ',
      },
    },
  },
  'no-NO': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'kr ',
        priceCurrencySuffix: ',-',
      },
    },
  },
  'pl-PL': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' zł',
      },
    },
  },
  'pt-BR': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'R$ ',
      },
      decimalDigitsCount: 2,
    },
  },
  'pt-PT': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'ro-RO': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'ru-RU': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' руб.',
      },
      decimalDigitsCount: 2,
    },
  },
  'sk-SK': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'sl-SI': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' €',
      },
      decimalDigitsCount: 2,
    },
  },
  'sr-RS': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' EUR',
      },
      decimalDigitsCount: 2,
    },
  },
  'sv-SE': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' kr',
      },
    },
  },
  'th-TH': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'THB ',
      },
    },
  },
  'tr-TR': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' ₺',
      },
    },
  },
  'tr-ZY': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' TL',
      },
    },
  },
  'vi-VN': {
    priceFormat: {
      currencyFormat: {
        priceCurrencySuffix: ' ₫',
      },
    },
  },
  'zh-CN': {
    priceFormat: {
      decimalDigitsCount: 2,
    },
  },
  'zh-HK': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: 'HK$',
      },
    },
  },
  'zh-TW': {
    priceFormat: {
      currencyFormat: {
        priceCurrencyPrefix: '$',
      },
    },
  },
};
