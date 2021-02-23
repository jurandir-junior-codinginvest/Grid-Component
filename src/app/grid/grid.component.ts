import { Component, Input, OnInit } from '@angular/core';
import { Column, Row, Table } from '../class/Table';
import { GridService } from '../services/grid.service';

@Component({
  selector: 'j-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  public tables: Array<Table> = new Array<Table>();
  public tableSelected: string = "ATIVOS";
  public tableSelectedIndex: number = 0;

  private CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private SPECIAL_CHARACTERS = "ÂÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛ:!' ";
  private NUMERIC = "0123456789";
  private ALLOWED_CHARACTERS = this.CHARACTERS + this.CHARACTERS.toLowerCase() + this.SPECIAL_CHARACTERS + this.SPECIAL_CHARACTERS.toLowerCase();
  private ALPHANUMERIC = this.ALLOWED_CHARACTERS + this.NUMERIC;

  @Input()
  public meta: any;

  constructor(public gridService: GridService) {
  }

  //--
  private compileFormulas(currentTable: Table) {
    currentTable.rows.forEach((row) => {
      row.columns.forEach((column) => {
        column.compiledValue = this.executeFormula(column.value, currentTable.name);
      });
    });
  }

  private executeFormula(formula: string, currentTableName: string) {
    if (formula && formula.toString().indexOf("=") > -1) {
      formula = formula.substr(1);
      let command = this.getCommand(formula);
      switch (command) {
        case "SUM":
          let sumResult = eval(this.executeSUM(formula, currentTableName));
          return sumResult.toString();
        case "COUNTA":
          let countaResult = eval(this.executeCOUNTA(formula,currentTableName));
          return countaResult.toString();
        default:
          let result = eval(this.defaultExecuteFormula(formula, currentTableName));
          return result.toString();
      }
    } else {
      return formula;
    }
  }

  private executeCOUNTA(countaFormula: string, currentTableName: string) {
    let countaResult = 0;
    let command = "COUNTA";
    let startCOUNTA = countaFormula.indexOf(command);
    countaFormula = countaFormula.substr(startCOUNTA+command.length);
    let endCOUNTA = countaFormula.indexOf(")")+1;
    let countaPlaceHolder = countaFormula.substr(startCOUNTA,endCOUNTA);
    let addresses = this.getAddresses(countaFormula, currentTableName);
    let cells = this.getCellsFromTable(addresses[0].normalizedAddress);
    cells.forEach(cell => {
      countaResult += 1;
    });
    let counta =  countaResult.toString();
    return countaFormula.replace(countaPlaceHolder,counta);
  }

  private executeSUM(sumFormula: string, currentTableName: string) {
    let sumResult = 0;
    let command = "SUM";
    let startSUM = sumFormula.indexOf(command);
    sumFormula = sumFormula.substr(startSUM+command.length);
    let endSUM = sumFormula.indexOf(")")+1;
    let sumPlaceHolder = sumFormula.substr(startSUM,endSUM);
    let addresses = this.getAddresses(sumFormula, currentTableName);
    let cells = this.getCellsFromTable(addresses[0].normalizedAddress);
    cells.forEach(cell => {
      sumResult += parseFloat(cell);
    });
    return sumFormula.replace(sumPlaceHolder,sumResult.toString());
  }

  private defaultExecuteFormula(formula: string, currentTableName: string) {
    let addresses = this.getAddresses(formula, currentTableName);
    for (let i = 0; i < addresses.length; i++) {
      let cell = this.getCellsFromTable(addresses[i].normalizedAddress)[0];
      let cellValue = <string>this.executeFormula(cell, currentTableName);
      formula = formula.replace(addresses[i].rawAddress, cellValue.toString());
    }
    return formula;
  }

  private getCommand(formula: string) {
    let command = "";
    for (let i = 0; i < formula.length; i++) {
      let char = formula[i];
      if (this.CHARACTERS.indexOf(char) > -1) {
        command += char;
      } else {
        if (command.length > 2) {
          return command;
        } else {
          command = "";
        }
      }
    }
    return "NONE";
  }

  private getAddresses(formulaCommand: string, currentTableName: string) {
    let addresses = new Array<addressNormalization>();
    let address = "";
    for (let i = 0; i < formulaCommand.length; i++) {
      let char = formulaCommand[i];
      if (this.ALPHANUMERIC.indexOf(char) > -1) {
        address += char;
      } else {
        if (address.length > 0) {
          let hasColumun = this.ALLOWED_CHARACTERS.indexOf(address.substr(0, 1)) > -1;

          let newAddress: addressNormalization = { rawAddress: address, normalizedAddress: this.normalizeAddress(address, currentTableName) };
          if (hasColumun) {
            addresses.push(newAddress);
          }

          address = "";
        }
      }
    }
    if (address.length > 0) {
      let hasColumun = this.ALLOWED_CHARACTERS.indexOf(address.substr(0, 1)) > -1;
      let newAddress: addressNormalization = { rawAddress: address, normalizedAddress: this.normalizeAddress(address, currentTableName) };
      if (hasColumun) {
        addresses.push(newAddress);
      }
    }
    return addresses;
  }

  private normalizeAddress(address: string, currentTableName: string) {
    return address.indexOf("!") > -1 ? address : "'" + currentTableName + "'!" + address;
  }

  private getCellsFromTable(normalizedAddress: string) {
    let tableName = normalizedAddress.split("!")[0].replace("'", "").replace("'", "");
    let cellAddress = normalizedAddress.split("!")[1];
    let table = <Table>this.getTableByName(tableName);
    return this.getCells(cellAddress, table);
  }

  private getTableByName(tableName: string) {
    return this.tables.find(x => x.name == tableName);
  }

  private getCells(cellAddress: string, table: Table) {
    let cells = new Array<string>();
    let isRange = cellAddress.indexOf(":") > -1;
    if (!isRange) {
      table.rows.forEach((row) => {
        row.columns.forEach((column) => {
          if (column.orderBy.placeholder == cellAddress) {
            let columnValue = this.executeFormula(column.value,table.name);
            cells.push(columnValue);
          }
        });
      });
    } else {
      let from = cellAddress.split(":")[0];
      let to = cellAddress.split(":")[1];
      from = from.length == 1 ? from + "1" : from;
      to = to.length == 1 ? to + table.rows.length+1 : to;

      let fromColumn = from.substr(0, 1);
      let fromRow = from.substr(1);
      let toColumn = to.substr(0, 1);
      let toRow = to.substr(1);

      let fromColumnIndex = this.getNumberByChar(fromColumn);
      let fromRowIndex = parseInt(fromRow);
      let toColumnIndex = this.getNumberByChar(toColumn);
      let toRowIndex = parseInt(toRow);

      //direction 0 = left, 1 = right
      let columnDirection = fromColumnIndex <= toColumnIndex ? 0 : 1;
      let rowDirection = fromRowIndex <= toRowIndex ? 0 : 1;

      table.rows.forEach((row) => {
        row.columns.forEach((column) => {
          let cellColumn = this.getNumberByChar(column.orderBy.placeholder.substr(0, 1));
          let cellRow = parseInt(column.orderBy.placeholder.substr(1));
          let isColumnInRange = false;
          let isRowInRange = false;

          if (columnDirection == 0) {
            if (cellColumn >= fromColumnIndex && cellColumn <= toColumnIndex) {
              isColumnInRange = true;
            }
          } else {
            debugger
          }

          if (rowDirection == 0) {
            if (cellRow >= fromRowIndex && cellRow <= toRowIndex) {
              isRowInRange = true;
            }
          } else {
            debugger
          }

          if (isColumnInRange && isRowInRange) {
            let columnValue = this.executeFormula(column.value,table.name);
            cells.push(columnValue);
          }

        });
      });
    }

    return cells;
  }

  private getCharByNumber(charNumber: number) {
    return this.CHARACTERS[charNumber];
  }

  private getNumberByChar(char: string) {
    return this.CHARACTERS.indexOf(char);
  }
  //--


  ngOnInit(): void {
    this.tables = this.readTable(this.meta);
    for (let i = 0; i < this.tables.length; i++) {
      let table = this.tables[i];
      this.compileFormulas(table);
    }
  }

  public selectedTake(itemValue: string, currentTake: number) {
    let selectedTake = parseInt(itemValue);
    return selectedTake == currentTake;
  }

  public getRows(table: Table) {
    let rows = this.searchOperation(table);
    rows = this.ordering(rows);
    let start = table.page == 1 ? 0 : (((table.page - 1) * table.take));
    let end = table.page * table.take;
    rows = (<Array<Row>>rows).slice(start, end);
    return rows;
  }

  public selectColumn(column: Column, table: Table) {
    column.selected = !column.selected;
    if (column.selected) {
      table.searchColumns.push(column.name);
    } else {
      let searchIndex = table.searchColumns.findIndex(x => x == column.name);
      table.searchColumns.splice(searchIndex, 1);
    }
  }

  private ordering(rows: Array<Row>) {
    let selectedOrderColumn = this.tables[this.tableSelectedIndex].selectedOrderColumn;
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

  private searchOperation(table: Table) {
    switch (table.searchOperation) {
      case "contains":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => z.compiledValue.toString().indexOf(table.searchText) > -1) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue.toString().indexOf(table.searchText) > -1) > -1);
      case "equals":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => z.compiledValue == table.searchText) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue == table.searchText) > -1);
      case "startwith":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => z.compiledValue.toString().startsWith(table.searchText)) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue.toString().startsWith(table.searchText)) > -1);
      case "endwith":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => z.compiledValue.toString().endsWith(table.searchText)) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && z.compiledValue.toString().endsWith(table.searchText)) > -1);
      case "higher":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) < parseFloat(table.searchText)) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) > parseFloat(table.searchText)) > -1);
      case "smaller":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) > parseFloat(table.searchText)) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) < parseFloat(table.searchText)) > -1);
      case "equalhigher":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) <= parseFloat(table.searchText)) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) >= parseFloat(table.searchText)) > -1);
      case "equalsmaller":
        if (table.searchAllColumns)
          return table.rows.filter(x => x.columns.findIndex(z => parseFloat(z.compiledValue) >= parseFloat(table.searchText)) > -1);
        else
          return table.rows.filter(x => x.columns.findIndex(z => table.searchColumns.findIndex(y => y == z.name) > -1 && parseFloat(z.compiledValue) <= parseFloat(table.searchText)) > -1);
    }
    return new Array<Row>();
  }

  public setPage(page: number, table: Table) {
    table.page = page;
  }

  public allowGoToStart(table: Table) {
    return table.page > 4;
  }

  public allowGoBack(table: Table) {
    return table.page > 3;
  }

  public allowGoNext(table: Table) {
    let take = this.getCurrentTake(table);
    return table.page < (take - 1);
  }

  public allowGoToEnd(table: Table) {
    let take = this.getCurrentTake(table);
    return table.page < (take - 2);
  }

  private getCurrentTake(table: Table) {
    return (table.rows.length / table.take) - 1;
  }

  public getPreviewPage(table: Table) {
    let previewsPage = [];
    let pageTakeDifference = table.take - table.page;
    let difference = 2 - pageTakeDifference;
    difference = difference < 0 ? 0 : difference;
    let previewDifference = table.page - (3 + difference);

    let page = table.page;
    if (page > 1) {
      for (let i = page; i > previewDifference; i--) {
        if (page - i > 0 && (page - i) + previewDifference > 0)
          previewsPage.push((page - i) + previewDifference);
      }
    }
    return previewsPage;
  }

  public getNextPage(table: Table) {
    let take = this.getCurrentTake(table);
    let nextDifference = table.page + 2;
    if (table.page < 4)
      nextDifference = 5;
    let nextPage = [];
    for (let i = table.page; i < nextDifference; i++) {
      if (i <= take)
        nextPage.push(i + 1);
    }
    return nextPage;
  }

  public getTo(table: Table) {
    return ((table.page * table.take) > table.rows.length) ? table.rows.length : table.page * table.take;
  }

  public getFrom(table: Table) {
    return table.page == 1 ? 1 : (((table.page - 1) * table.take) + 1);
  }

  public save() {
    console.error("not implemented");
  }

  private placeholderMap(table: Table) {
    let rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      for (let j = 0; j < row.columns.length; j++) {
        let column = row.columns[j];
        column.orderBy.placeholder = this.getCharByNumber(j) + (i + 2);
      }
    }
  }

  private readTable(meta: any) {
    let tables = new Array<Table>();
    let tableNames = this.readTableNames(meta);
    for (let i = 0; i < tableNames.length; i++) {
      let tableName = tableNames[i];
      let table = new Table();
      table.name = tableName;
      table.rows = this.readRows(meta[tableName]);
      this.placeholderMap(table);
      tables.push(table);
    }
    return tables;
  }

  private readTableNames(meta: any) {
    let tableNames = new Array<string>();
    for (let name in meta) {
      tableNames.push(name);
    }
    return tableNames;
  }

  private readRows(meta: any): Array<Row> {
    if (Array.isArray(meta)) {
      return this.readRowIfArray(meta);
    } else {
      return this.readRowIfNotArray(meta);
    }
  }

  private readRowIfArray(meta: any): Array<Row> {
    let rows = new Array<Row>();
    for (let i = 0; i < meta.length; i++) {
      let metaRow = meta[i];
      let row = new Row();
      row.columns = this.readColumns(metaRow);
      rows.push(row);
    }
    return rows;
  }

  private readColumns(metaRow: any) {
    let columns = new Array<Column>();
    for (let columnName in metaRow) {
      let column = new Column();
      column.name = columnName;
      column.selected = false;
      column.value = metaRow[columnName];
      columns.push(column);
    }
    return columns;
  }

  private readRowIfNotArray(meta: any): Array<Row> {
    let rows = new Array<Row>();
    let row = new Row();
    row.columns = this.readColumns(meta);
    rows.push(row);
    return rows;
  }

  public isTable(item: any) {
    let table = item[0] instanceof Table;
    return table;
  }

  public clickNav(name: any, index: any) {
    this.tableSelected = name;
    this.tableSelectedIndex = index;
  }

  public newRow() {
    let columns = this.tables[this.tableSelectedIndex].rows[0].columns;
    let emptyColumns = [];
    for (let i = 0; i < columns.length - 1; i++) {
      emptyColumns.push(columns[i]);
    }
    return emptyColumns;
  }
}

type addressNormalization = {
  rawAddress: string;
  normalizedAddress: string;
}
