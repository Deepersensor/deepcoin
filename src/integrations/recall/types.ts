export interface Portfolio {
  totalValue: number;
  tokens: TokenBalance[];
}

export interface TokenBalance {
  token: string;
  amount: number;
  value: number;
}

export interface TradeRequest {
  fromToken: string;
  toToken: string;
  amount: number;
}

export interface TradeResponse {
  success: boolean;
  message: string;
}

export interface Price {
  token: string;
  price: number;
}
