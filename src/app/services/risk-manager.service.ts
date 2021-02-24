import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Asset } from "../types/asset";
import { Period } from "../types/period";
import { RiskManager } from "../types/Risk-manager"

@Injectable()
export class RiskManagerService{
    private riskManager:RiskManager;
    public cotations:Array<Cotation>;
    constructor(private http:HttpClient){
        this.cotations = new Array<Cotation>();
        this.riskManager = {
            assets:new Array<Asset>(),
            cash:{
                code:"CASH",
                quantity:{
                    initial:69994,
                    final:75584,
                    difference:0, //TODO: add formula initial - final
                },
                price:{
                   unit:0.01,
                   total:755.84, //TODO: add formula unit*quantity.final
                },
                order:{
                    buy:0,
                    sell:0
                }
            },
            statistic:{
                assetsQuantity:623, //TODO: add formula
                assetsTotals:{
                    initial:7059.84,
                    final:7003.94,
                    available:55.90 //TODO: add formula initial - final
                },
                perAsset:{
                    participation:10, //TODO: add formula
                    mediumPrice:775.98, //TODO: add formula
                },
                balance:0, //TODO: add formula
                estate:7759.78//TODO: add formula
            },
            historic:new Array<Period>(),
        };   
       
        //brml3
        this.riskManager.assets.push({code:"BRML3",quantity:73,price:{unit:10.67,total:778.91/*TODO: add formula*/},participation:10.03/*TODO: add formula*/,order:{buy:0,sell:0/*TODO: add formula*/}});
        
        //15/01/2020
        this.riskManager.historic.push({assetsQuantity:623,assetsMediumPrice:775.98,estate:630.45,income:7759.78,date:new Date("2020-12-15")});
    }

    public async getStockPrice(item:any){
        let cotation = this.cotations.find(x=>x.symbol==item.symbol);
        if(!cotation){
         cotation = {symbol:item.symbol,price:"Carregando..."};
         let result = <any>(await this.http.get("/stocks/finance/stock_price?key=026c5f3a&symbol="+item.symbol).toPromise().catch((exc)=>{return exc}));
         if(result.status==403){
            cotation.price = result.statusText;
         }else{
            cotation.price = result["results"][item.symbol.toUpperCase()]["price"];
         }
         this.cotations.push(cotation);
        }
        return cotation.price;
    }

    public get(){
        return this.riskManager;
    }
    
}

type Cotation = {
    price:string;
    symbol:string;
  }