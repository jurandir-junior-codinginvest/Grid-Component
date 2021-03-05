import { Injectable } from "@angular/core";
import { Column } from "../class/Column";
import { Row } from "../class/Row";
import { Table } from "../class/Table";
import { OrderByType } from "../enum/OrderByType";
import { ComboBox } from "../types/ComboBox";
import { FormulaService } from "./formula.service";
import { PaginationService } from "./pagination.service";

@Injectable()
export class GridService {
    private tableNames: Array<string>;
    private tables: Array<Table> = new Array<Table>();
    private tableSelected: Table | null;
    private operationSelector: Array<ComboBox> = [
        { "label": "Contains", "value": "contains" },
        { "label": "Equals", "value": "equals" },
        { "label": "Start With", "value": "startwith" },
        { "label": "End With", "value": "endwith" },
        { "label": ">", "value": "higher" },
        { "label": "<", "value": "smaller" },
        { "label": ">=", "value": "equalhigher" },
        { "label": "<=", "value": "equalsmaller" },
    ];
    private takeSelector: Array<ComboBox> = [
        { "label": "10", "value": "10" },
        { "label": "25", "value": "25" },
        { "label": "50", "value": "50" },
        { "label": "100", "value": "100" },
        { "label": "250", "value": "250" },
        { "label": "500", "value": "500" },
        { "label": "1000", "value": "1000" }
    ];

    constructor(private formulaService: FormulaService, private paginationService: PaginationService) {
        this.tableNames = new Array<string>();
        this.tableSelected = null;
    }

    public init(data: any) {
        this.tables = this.transformJsonToTable(data);
        this.formulaService.init(this.tables);
        for (let i = 0; i < this.tables.length; i++) {
            let table = this.tables[i];
            this.tableNames.push(table.name);
            this.formulaService.compileFormulas(table);
        }
        if (this.tables.length > 0) {
            this.tableSelected = this.tables[0];
            this.paginationService.init(this.tableSelected);
        }
    }

    public save(){}

    public export(data:any){
        let fileName = window.prompt("Please type file name:");
        var sJson = JSON.stringify(data);
        var element = document.createElement('a');
        element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(sJson));
        element.setAttribute('download', fileName+".json");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click(); // simulate click
        document.body.removeChild(element);
    }

    public setExternalFunctions(methodName: string, method: any) {
        this.formulaService.setExternalFunctions(methodName, method);
    }

    public getLoadedTableNames() {
        return this.tableNames;
    }

    public getCurrentTable() {
        return this.tableSelected;
    }

    public getTakeSelector() {
        return this.takeSelector;
    }

    public getOperationSelector() {
        return this.operationSelector;
    }

    public activeTable(index: number) {
        this.tableSelected = this.tables[index];
        return this.tableSelected;
    }

    public isTableActive(index: number) {
        return this.tables[index] == this.tableSelected;
    }

    public getColumns() {
        if (this.tableSelected) {
            return this.tableSelected.rows[0].columns;
        }
        return new Array<Column>();
    }

    public getRows() {
        if (this.tableSelected) {
            let rows = this.searchOperation();
            rows = this.ordering(rows);
            let start = this.tableSelected.page == 1 ? 0 : (((this.tableSelected.page - 1) * this.tableSelected.take));
            let end = this.tableSelected.page * this.tableSelected.take;
            rows = (<Array<Row>>rows).slice(start, end);
            return rows;
        }
        return new Array<Row>();
    }

    public changeSearchText(event: any) {
        if (this.tableSelected) {
            this.tableSelected.searchText = event.target.value;
        }
    }

    public selectAllCoumns() {
        if (this.tableSelected) {
            this.tableSelected.searchAllColumns = !this.tableSelected.searchAllColumns;
            let row = this.tableSelected.rows[0];
            for (let i = 0; i < row.columns.length; i++) {
                let column = row.columns[i];
                column.selected = !this.tableSelected.searchAllColumns;
                if (column.selected) {
                    this.tableSelected.searchColumns.push(column.name);
                } else {
                    let searchIndex = this.tableSelected.searchColumns.findIndex(x => x == column.name);
                    this.tableSelected.searchColumns.splice(searchIndex, 1);
                }
            }
        }
    }

    public changeTake(event: any) {
        if (this.tableSelected) {
            this.tableSelected.take = event.target.value;
            this.tableSelected.page = 1;
        }
    }

    public changeOperation(event: any) {
        if (this.tableSelected) {
            this.tableSelected.searchOperation = event.target.value;
        }
    }

    public toOrder(column: Column) {
        if (this.tableSelected) {
            if (column.orderBy.orderByType == OrderByType.ascend) {
                column.orderBy.orderByType = OrderByType.descend;
            } else {
                if (column.orderBy.orderByType == OrderByType.descend) {
                    column.orderBy.orderByType = OrderByType.neutral;
                } else {
                    column.orderBy.orderByType = OrderByType.ascend;
                }
            }

            if (column.name != this.tableSelected.selectedOrderColumn.name)
                this.tableSelected.selectedOrderColumn.orderBy.orderByType = OrderByType.neutral;

            this.tableSelected.selectedOrderColumn = column;
        }
    }

    public selectColumn(column: Column) {
        if (this.tableSelected) {
            column.selected = !column.selected;
            if (column.selected) {
                this.tableSelected.searchColumns.push(column.name);
            } else {
                let searchIndex = this.tableSelected.searchColumns.findIndex(x => x == column.name);
                this.tableSelected.searchColumns.splice(searchIndex, 1);
            }
        }
    }

    //Private Processors
    private ordering(rows: Array<Row>) {
        if (this.tableSelected) {
            let selectedOrderColumn = this.tableSelected.selectedOrderColumn;
            return rows.sort((row1, row2) => {
                let column1 = row1.columns.find(x => x.name == selectedOrderColumn.name);
                let column2 = row2.columns.find(x => x.name == selectedOrderColumn.name);
                let compiledValue1 = column1 ? column1.compiledValue : "0";
                let compiledValue2 = column2 ? column2.compiledValue : "0";
                if (selectedOrderColumn.orderBy.orderByType == 1)
                    return parseFloat(compiledValue1) - parseFloat(compiledValue2);
                else
                    return parseFloat(compiledValue2) - parseFloat(compiledValue1);
            });
        }
        return new Array<Row>();
    }

    private searchOperation() {
        if (this.tableSelected) {
            let tableSelected = <Table>this.tableSelected;
            switch (tableSelected.searchOperation) {
                case "contains":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => z.compiledValue.toString().indexOf(tableSelected.searchText) > -1) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue.toString().indexOf(tableSelected.searchText) > -1) > -1);
                case "equals":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => z.compiledValue == tableSelected.searchText) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue == tableSelected.searchText) > -1);
                case "startwith":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => z.compiledValue.toString().startsWith(tableSelected.searchText)) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue.toString().startsWith(tableSelected.searchText)) > -1);
                case "endwith":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => z.compiledValue.toString().endsWith(tableSelected.searchText)) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue.toString().endsWith(tableSelected.searchText)) > -1);
                case "higher":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) < parseFloat(tableSelected.searchText)) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) > parseFloat(tableSelected.searchText)) > -1);
                case "smaller":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) > parseFloat(tableSelected.searchText)) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) < parseFloat(tableSelected.searchText)) > -1);
                case "equalhigher":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) <= parseFloat(tableSelected.searchText)) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) >= parseFloat(tableSelected.searchText)) > -1);
                case "equalsmaller":
                    if (tableSelected.searchAllColumns)
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) >= parseFloat(tableSelected.searchText)) > -1);
                    else
                        return tableSelected.rows.filter(x => x.columns.findIndex(z => tableSelected.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) <= parseFloat(tableSelected.searchText)) > -1);
            }
        }
        return new Array<Row>();
    }

    private transformJsonToTable(data: any) {
        let tables = new Array<Table>();
        let tableNames = this.getTableNames(data);
        for (let i = 0; i < tableNames.length; i++) {
            let tableName = tableNames[i];
            let table = new Table();
            table.name = tableName;
            table.rows = this.readRows(data[tableName]);
            tables.push(table);
        }
        return tables;
    }

    private getTableNames(data: any) {
        let tableNames = new Array<string>();
        for (let name in data) {
            tableNames.push(name);
        }
        return tableNames;
    }

    private readRows(data: any): Array<Row> {
        if (Array.isArray(data)) {
            return this.readRowIfArray(data);
        } else {
            return this.readRowIfNotArray(data);
        }
    }

    private readRowIfArray(data: any): Array<Row> {
        let rows = new Array<Row>();
        for (let i = 0; i < data.length; i++) {
            let metaRow = data[i];
            let row = new Row();
            row.columns = this.readColumns(metaRow);
            rows.push(row);
        }
        return rows;
    }

    private readColumns(dataRow: any) {
        let columns = new Array<Column>();
        for (let columnName in dataRow) {
            let column = new Column();
            column.name = columnName;
            column.selected = false;
            column.value = dataRow[columnName];
            columns.push(column);
        }
        return columns;
    }

    private readRowIfNotArray(data: any): Array<Row> {
        let rows = new Array<Row>();
        let row = new Row();
        row.columns = this.readColumns(data);
        rows.push(row);
        return rows;
    }
    //--End of others processors
}