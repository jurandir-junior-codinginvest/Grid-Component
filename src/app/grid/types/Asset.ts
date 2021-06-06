import { Order } from "./Order";
import { Price } from "./Price";

export type Asset = {
    code:string;
    quantity:number;
    price:Price;
    participation:number;
    order:Order;
}