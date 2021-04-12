import { Component, OnInit } from '@angular/core';
import { RiskManagerService } from '../services/risk-manager.service';
import { GridService } from '../services/grid.service';
import { ConvertionService } from '../services/convertion.service';
import { Cryptography } from '../services/cryptography';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public meta: any;
  public externalFunctions: any;
  public editorTitle = "Balanceamento de ativos";
  constructor(public riskManagerService: RiskManagerService, private gridService: GridService, private conversionService:ConvertionService, private cryptography:Cryptography) {
    this.gridService.setExternalFunctions("getPrice", async (item: any) => await this.getPrice(item));
    this.gridService.setExternalFunctions("toBRL",async(item:any)=>await this.conversionService.decimalToBRL(eval(item.number)));
    this.gridService.setExternalFunctions("Encrypt", (item:any)=>this.Encrypt(item.text));
    this.gridService.setExternalFunctions("Decrypt", (item:any)=>this.Decrypt(item.text));
  }

  private async getPrice(item: any) {
    return await this.riskManagerService.getStockPrice(item);
  }

  private async Encrypt(text:string){
    return this.cryptography.Encrypt("Password",text);
  }

  private async Decrypt(encrypted:string){
    return this.cryptography.Decrypt("Password",encrypted);
  }


  ngOnInit(): void {
  }
}

