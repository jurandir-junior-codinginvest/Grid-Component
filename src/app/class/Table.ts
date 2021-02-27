import { Column } from "./Column";
import { Row } from "./Row";

export class Table{
    public name:string = "";
    public rows:Array<Row> = new Array<Row>();
    public showReference:boolean = false;
    public page:number = 1;
    public take:number = 10;
    public searchAllColumns:boolean = true;
    public searchColumns:Array<string> = new Array<string>();
    public searchText:string = "";
    public searchOperation:string = "contains";
    public selectedOrderColumn:Column = new Column();
}

