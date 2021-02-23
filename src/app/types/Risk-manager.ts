import { Asset } from "./asset";
import { Cash } from "./cash";
import { Period } from "./period";
import { Statistic } from "./statistic";

export type RiskManager = {
    assets:Array<Asset>;
    cash:Cash;
    statistic:Statistic;
    historic:Array<Period>;
}