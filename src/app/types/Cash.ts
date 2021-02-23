import { Order } from "./Order"
import { Price } from "./Price"
import { Quantity } from "./Quantity"

export type Cash = {
   code:string; 
   quantity:Quantity;
   price:Price;
   order:Order;
}


