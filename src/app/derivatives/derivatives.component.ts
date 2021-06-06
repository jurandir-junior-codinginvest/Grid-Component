import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { GridService } from '../grid/services/grid.service';

@Component({
  selector: 'derivatives',
  templateUrl: './derivatives.component.html',
  styleUrls: ['./derivatives.component.css']
})
export class DerivativesComponent implements OnInit {
  public workingDays?:number=45;
  public investiment?:number=20000;
  public balancing?:number=8;

  constructor(private httpClient:HttpClient,private gridService:GridService) { }

  ngOnInit(): void {
  }

  async search(){
    if(this.workingDays && this.balancing && this.investiment){
      let margin = this.investiment/this.balancing;
      let data = await this.httpClient.post("/derivatives/getSpreads",{"days":this.workingDays,"margin":margin.toFixed(2)}).toPromise();
      this.gridService.init(data);
    }
  }
}
