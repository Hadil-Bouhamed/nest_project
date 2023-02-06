export interface CreateOrderDTO {
    product: string;
    quantity: number;
}
export interface CreateOrdersDTO {
    products: Array<{
      product: string;
      quantity: number;
    }>;
  }