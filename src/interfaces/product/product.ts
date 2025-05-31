export interface ProductWithPrice {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  price?: {
    value: number;
    currency: string;
    discountedValue?: number;
  };
  image?: string;
  searchKeywords?: Record<string, SearchKeyword[]>;
}

export interface PriceInfo {
  amount: number;
  currency: string;
  discountedAmount?: number;
}

export interface ProductCardProps {
  id: string;
  name: string;
  image?: string;
  price?: {
    value: number;
    currency: string;
    discountedValue?: number;
  };
  description?: string;
}

interface SearchKeyword {
  text: string;
  suggestTokenizer?: {
    type: 'whitespace' | 'custom';
    inputs?: string[];
  };
}

export interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}
