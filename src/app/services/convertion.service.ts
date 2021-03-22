import { Injectable } from "@angular/core";

@Injectable()
export class ConvertionService{
    public decimalToBRL(quantity:number){
       let decimalBRL = quantity.toFixed(2);
       let quantities = decimalBRL.split('.');
       let reais = quantities[0];
       let cents = quantities[1];
       let result = "";
       let comma = 0;
       for(let i=reais.length-1;i>-1;i--){
        let number = reais[i];
        comma++;
        if(comma%3==0 && i!=0)
        {
            number = "."+number;
        }
        result=number+result;
       }
       result = "R$ "+result+","+cents;
       return result;
    }
}