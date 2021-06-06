import { Asset } from "./Asset";
import { Cash } from "./Cash";
import { Period } from "./Period";
import { Statistic } from "./Statistic";

export type RiskManager = {
    assets:Array<Asset>;
    cash:Cash;
    statistic:Statistic;
    historic:Array<Period>;
}