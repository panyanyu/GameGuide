export const ITAD_API_KEY = process.env.ITAD_API_KEY || '';

export const ITAD_BASE_URL = 'https://api.isthereanydeal.com';

export const SUPPORTED_SHOPS = [
  { id: 'steam', name: 'Steam' },
  { id: 'epic', name: 'Epic Games' },
  { id: 'gog', name: 'GOG' },
  { id: 'wegame', name: 'WeGame' },
] as const;

export type ShopId = typeof SUPPORTED_SHOPS[number]['id'];
