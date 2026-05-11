export interface ShopPrice {
  shop: string;
  shopName: string;
  price: number | null;
  cut: number;
  url: string;
}

export interface GameDeal {
  id: string;
  title: string;
  image?: string;
  shops: ShopPrice[];
  cheapest: number | null;
  cheapestCut: number;
}

export interface ITADSearchResult {
  id: string;
  title: string;
  image?: string;
}

export interface ITADPriceResult {
  shop: string;
  price: number | null;
  cut: number;
  url: string;
}
