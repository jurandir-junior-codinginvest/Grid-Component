import { Component, Input, OnInit } from '@angular/core';
import { Table } from '../class/Table';

@Component({
  selector: 'sub-grid',
  templateUrl: './sub-grid.component.html',
  styleUrls: ['./sub-grid.component.css']
})
export class SubGridComponent implements OnInit {

  @Input()
  public table!: Table;

  constructor() { }

  ngOnInit(): void {
  }

}
