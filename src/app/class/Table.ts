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

    public operationSelector:Array<ComboBox> = [
        {"label":"Contains","value":"contains"},
        {"label":"Equals","value":"equals"},
        {"label":"Start With","value":"startwith"},
        {"label":"End With","value":"endwith"},
        {"label":">","value":"higher"},
        {"label":"<","value":"smaller"},
        {"label":">=","value":"equalhigher"},
        {"label":"<=","value":"equalsmaller"},
    ];

    public takeSelector:Array<ComboBox> = [
        {"label":"10","value":"10"},
        {"label":"25","value":"25"},
        {"label":"50","value":"50"},
        {"label":"100","value":"100"},
        {"label":"250","value":"250"},
        {"label":"500","value":"500"},
        {"label":"1000","value":"1000"}
    ];

    public changeSearchText(event:any){
        this.searchText = event.target.value;
    }

    public selectAllCoumns(){
        this.searchAllColumns=!this.searchAllColumns;
            let row = this.rows[0];
            for(let i=0;i<row.columns.length;i++){
                let column = row.columns[i];
                column.selected = !this.searchAllColumns;
                if(column.selected){
                    this.searchColumns.push(column.name);
                }else{
                    let searchIndex = this.searchColumns.findIndex(x=>x==column.name);
                    this.searchColumns.splice(searchIndex,1);
                }
            }
    }

    public changeTake(event:any){
        this.take = event.target.value;
        this.page = 1;
    }

    public changeOperation(event:any){
        this.searchOperation = event.target.value;
    }

    public toOrder(column:Column){
        if(column.orderBy.orderByType==OrderByType.ascend){
            column.orderBy.orderByType=OrderByType.descend;
        }else{
            if(column.orderBy.orderByType==OrderByType.descend)
            {
                column.orderBy.orderByType=OrderByType.neutral;
            }else{
                column.orderBy.orderByType=OrderByType.ascend;
            }
        }

        if(column.name!=this.selectedOrderColumn.name)
        this.selectedOrderColumn.orderBy.orderByType = OrderByType.neutral;

        this.selectedOrderColumn = column;
    }
}

export class Row{
    public columns:Array<Column>=new Array<Column>();
}

export class Column{
    public name:string = "";
    public value:any;
    public compiledValue:string = "";
    public selected:boolean = false;
    public orderBy:OrderBy = {placeholder:"",orderByType:OrderByType.neutral};
}

type ComboBox = {
    label:string;
    value:string;
}

export type OrderBy = {
    placeholder:string;
    orderByType:OrderByType;
}

enum OrderByType{
    neutral,
    ascend,
    descend
}


