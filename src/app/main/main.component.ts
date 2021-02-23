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
  constructor(public riskManagerService:RiskManagerService) {
    this.meta = Balanceamento;//this.riskManagerService.get();
   }

  ngOnInit(): void {
  }

}
