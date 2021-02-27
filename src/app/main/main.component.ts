import { Component, OnInit } from '@angular/core';
import { RiskManagerService } from '../services/risk-manager.service';
import {Balanceamento} from '../../assets/sample.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public meta:any;
  public externalFunctions:any;  

  constructor(public riskManagerService:RiskManagerService) {
    this.meta = Balanceamento;
    let getPrice = async(item:any)=> await this.getPrice(item);
    this.externalFunctions = {"getPrice":getPrice};
 }

  private async getPrice(item:any){
    return await this.riskManagerService.getStockPrice(item);
  }

  ngOnInit(): void {
  }
}

