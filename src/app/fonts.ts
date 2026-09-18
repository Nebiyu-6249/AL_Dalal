import { Marcellus, Instrument_Sans, Noto_Kufi_Arabic, IBM_Plex_Sans_Arabic } from 'next/font/google';

/**
 * Self-hosted at build time by next/font, so there is no request to a font CDN
 * and no layout shift while they load.
 *
 * Marcellus is Roman inscriptional capitals, which is what the salon's own
 * shopfront sign is set in. Instrument Sans carries the body text and has
 * tabular figures, so opening hours and phone numbers line up.
 */
const marcellus = Marcellus({
  subsets: ['latin'], weight: '400', display: 'swap', variable: '--font-marcellus',
});
const instrument = Instrument_Sans({
  subsets: ['latin'], display: 'swap', variable: '--font-instrument',
});
const kufi = Noto_Kufi_Arabic({
  subsets: ['arabic'], display: 'swap', variable: '--font-kufi',
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'], weight: ['400', '500'], display: 'swap', variable: '--font-plex-ar',
});

export const fontVars =
  `${marcellus.variable} ${instrument.variable} ${kufi.variable} ${plexArabic.variable}`;
