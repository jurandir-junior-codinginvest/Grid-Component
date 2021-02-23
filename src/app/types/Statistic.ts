import { PerAsset } from "./PerAsset"
import { Totals } from "./Totals"

export type Statistic = {
    assetsQuantity:number;
    assetsTotals:Totals;
    perAsset:PerAsset;
    balance:number;
    estate:number;
}

