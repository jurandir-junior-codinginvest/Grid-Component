import { Component, OnInit } from '@angular/core';
import { RiskManagerService } from '../services/risk-manager.service';
import * as Balanceamento from '../../assets/sample.json';
import { GridService } from '../services/grid.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public meta: any;
  public externalFunctions: any;

  constructor(public riskManagerService: RiskManagerService, private gridService: GridService) {
    this.meta = (<any>Balanceamento).default;
    this.gridService.setExternalFunctions("getPrice", async (item: any) => await this.getPrice(item));
  }

  private async getPrice(item: any) {
    return await this.riskManagerService.getStockPrice(item);
  }

  ngOnInit(): void {
  }
}

