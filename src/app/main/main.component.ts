import { Component, OnInit } from '@angular/core';
import { RiskManagerService } from '../services/risk-manager.service';
import { GridService } from '../services/grid.service';
import { ConvertionService } from '../services/convertion.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public meta: any;
  public externalFunctions: any;

  constructor(public riskManagerService: RiskManagerService, private gridService: GridService, private conversionService:ConvertionService) {
    this.gridService.setExternalFunctions("getPrice", async (item: any) => await this.getPrice(item));
    this.gridService.setExternalFunctions("toBRL",async(item:any)=>await this.conversionService.decimalToBRL(eval(item.number)));
  }

  private async getPrice(item: any) {
    return await this.riskManagerService.getStockPrice(item);
  }

  ngOnInit(): void {
  }
}

