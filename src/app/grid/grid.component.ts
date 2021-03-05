import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Table } from '../class/Table';
import { Column } from "../class/Column";
import { GridService } from '../services/grid.service';
import { PaginationService } from '../services/pagination.service';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  public tableNames: Array<string>;
  public currentTable!: Table;

  @Input()
  public data: any;

  @Input()
  public externalFunctions: any;

  constructor(private gridService: GridService,private paginationService:PaginationService, private changeDetector: ChangeDetectorRef) {
    this.tableNames = [];
  }

  ngOnInit() {
    if(this.data){
        this.gridService.init(this.data);
        this.currentTable = <Table>this.gridService.getCurrentTable();
      }
  }

  public importFile(event:any){
      let file = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsText(file,"UTF-8");
      fileReader.onload = ()=>{
        this.data = JSON.parse(<string>fileReader.result);
        this.ngOnInit();
      };
  }

  public exportFile(){
    this.gridService.export(this.data);
  }

  public detectChanges() {
    this.changeDetector.detectChanges();
  }

  public getTableNames() {
    return this.gridService.getLoadedTableNames();
  }

  public selectColumn(column: Column) {
    return this.gridService.selectColumn(column);
  }

  public getTakeSelector() {
    return this.gridService.getTakeSelector();
  }

  public getOperationSelector() {
    return this.gridService.getOperationSelector();
  }

  public changeSearchText(event: any) {
    return this.gridService.changeSearchText(event);
  }

  public changeOperation(event: any) {
    return this.gridService.changeOperation(event);
  }

  public selectAllCoumns() {
    return this.gridService.selectAllCoumns();
  }

  public toOrder(column: Column) {
    return this.gridService.toOrder(column);
  }

  public changeTake(event: any) {
    return this.gridService.changeTake(event);
  }

  public isTableActive(index: number) {
    return this.gridService.isTableActive(index);
  }

  public activeTable(index: number) {
    this.currentTable = this.gridService.activeTable(index);
  }

  public getColumns() {
    return this.gridService.getColumns();
  }

  public getRows() {
    return this.gridService.getRows();
  }

  public selectedTake(itemValue: string, currentTake: number) {
    return this.paginationService.selectedTake(itemValue, currentTake);
  }

  public setPage(page: number) {
    return this.paginationService.setPage(page);
  }

  public allowGoToStart() {
    return this.paginationService.allowGoToStart();
  }

  public allowGoBack() {
    return this.paginationService.allowGoBack();
  }

  public allowGoNext() {
    return this.paginationService.allowGoNext();
  }

  public allowGoToEnd() {
    return this.paginationService.allowGoToEnd();
  }

  public getPreviewPage() {
    return this.paginationService.getPreviewPage();
  }

  public getNextPage() {
    return this.paginationService.getNextPage();
  }

  public getTo() {
    return this.paginationService.getTo();
  }

  public getFrom() {
    return this.paginationService.getFrom();
  }

}


