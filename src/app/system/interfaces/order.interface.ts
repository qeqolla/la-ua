import { IProductResponse } from './product.interface';

export interface IOrderRequest {
  products: IProductResponse[];
  name: string;
  phoneNumber: string;
  city: string;
  street: string;
  house: string;
  comment: string;
  status: string;
  totalPrice: number;
}

export interface IOrderResponse extends IOrderRequest {
  id: number;
}
