import { Injectable, OnChanges, SimpleChanges } from "@angular/core";
import { Table } from "../class/Table";
import { AddressNormalization } from "../types/AddressNormalization";

@Injectable()
export class FormulaService{
    private CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private SPECIAL_CHARACTERS = "ÂÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛ:!' ";
    private NUMERIC = "0123456789";
    private ALLOWED_CHARACTERS = this.CHARACTERS + this.CHARACTERS.toLowerCase() + this.SPECIAL_CHARACTERS + this.SPECIAL_CHARACTERS.toLowerCase();
    private ALPHANUMERIC = this.ALLOWED_CHARACTERS + this.NUMERIC;
    private externalFunctions:any = {};
    private tables!:Array<Table>;
    
    constructor(){
    }
    
    public init(tables:Array<Table>){
        this.tables = tables;
        for(let i =0;i<this.tables.length;i++){
            let table = this.tables[i];
            this.placeholderMap(table);
        }
    }

    public setExternalFunctions(methodName:string,method:any){
        this.externalFunctions[methodName] = method;
    }

    public compileFormulas(currentTable: Table) {
        currentTable.rows.forEach((row) => {
            row.columns.forEach(async (column) => {
                column.compiledValue = await this.compileFormula(column.value, currentTable.name);
            });
        });
    }

    private async compileFormula(formula: string, currentTableName: string) {
        if (formula && formula.toString().indexOf("=") > -1) {
            formula = formula.substr(1);
            let command = this.getCommand(formula);
            switch (command) {
                case "SUM":
                    let sumResult = eval(await this.executeSUM(formula, currentTableName));
                    return sumResult.toString();
                case "COUNTA":
                    let countaResult = eval(await this.executeCOUNTA(formula, currentTableName));
                    return countaResult.toString();
                case "FUNCTION":
                    formula = formula.replace("FUNCTION", "");
                    let functionName = formula.split(",")[0].replace("(", "").replace("\"", "").replace("\"", "");
                    if(!this.externalFunctions[functionName])
                        return "Function not found!";
                    let formulaSplited = formula.split(",");
                    formulaSplited.shift();
                    let parameters = formulaSplited.join(",").replace(")", "");
                    parameters = await this.executeFormula(parameters, currentTableName);
                    let functionParameters = JSON.parse(parameters);
                    let externalFunction = await this.externalFunctions[functionName](functionParameters);
                    return externalFunction;
                default:
                    let formulaResult = await this.executeFormula(formula, currentTableName);
                    let result = eval(formulaResult);
                    return result.toString();
            }
        } else {
            return formula;
        }
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

    private async executeCOUNTA(countaFormula: string, currentTableName: string) {
        let command = "COUNTA";
        let startCOUNTA = countaFormula.indexOf(command);
        countaFormula = countaFormula.substr(startCOUNTA + command.length);
        let endCOUNTA = countaFormula.indexOf(")") + 1;
        let countaPlaceHolder = countaFormula.substr(startCOUNTA, endCOUNTA);
        let addresses = this.getAddresses(countaFormula, currentTableName);
        let cells = <string[]>await this.getCellsFromTable(addresses[0].standardAddress);
        let counta = cells.length.toString();
        return countaFormula.replace(countaPlaceHolder, counta);
    }

    private async executeSUM(sumFormula: string, currentTableName: string) {
        let sumResult = 0;
        let command = "SUM";
        let startSUM = sumFormula.indexOf(command);
        sumFormula = sumFormula.substr(startSUM + command.length);
        let endSUM = sumFormula.indexOf(")") + 1;
        let sumKeys = sumFormula.substr(startSUM, endSUM);
        let addresses = this.getAddresses(sumFormula, currentTableName);
        let cells = <string[]>await this.getCellsFromTable(addresses[0].standardAddress);
        cells.forEach((cell: any) => {
            sumResult += parseFloat(cell);
        });
        return sumFormula.replace(sumKeys, sumResult.toString());
    }

    private async executeFormula(formula: string, currentTableName: string) {
        let addresses = this.getAddresses(formula, currentTableName);
        for (let i = 0; i < addresses.length; i++) {
            let cells = await this.getCellsFromTable(addresses[i].standardAddress);
            let cell = cells[0];
            let cellValue = await this.compileFormula(cell, currentTableName);
            if (cellValue) {
                formula = formula.replace(addresses[i].rawAddress, cellValue.toString());
            }
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
        let addresses = new Array<AddressNormalization>();
        let address = "";
        for (let i = 0; i < formulaCommand.length; i++) {
            let char = formulaCommand[i];
            if (this.ALPHANUMERIC.indexOf(char) > -1) {
                address += char;
            } else {
                if (address.length > 0) {
                    let hasColumun = this.ALLOWED_CHARACTERS.indexOf(address.substr(0, 1)) > -1;

                    let newAddress: AddressNormalization = { rawAddress: address, standardAddress: this.getStandarAddresses(address, currentTableName) };
                    if (hasColumun) {
                        addresses.push(newAddress);
                    }

                    address = "";
                }
            }
        }
        if (address.length > 0) {
            let hasColumun = this.ALLOWED_CHARACTERS.indexOf(address.substr(0, 1)) > -1;
            let newAddress: AddressNormalization = { rawAddress: address, standardAddress: this.getStandarAddresses(address, currentTableName) };
            if (hasColumun) {
                addresses.push(newAddress);
            }
        }
        return addresses;
    }

    private getStandarAddresses(address: string, currentTableName: string) {
        return address.indexOf("!") > -1 ? address : "'" + currentTableName + "'!" + address;
    }

    private async getCellsFromTable(normalizedAddress: string) {
        let tableName = normalizedAddress.split("!")[0].replace("'", "").replace("'", "");
        let cellAddress = normalizedAddress.split("!")[1];
        let table = <Table>this.getTableByName(tableName);
        return await this.getCells(cellAddress, table);
    }

    private getTableByName(tableName: string) {
        return this.tables.find(x => x.name == tableName);
    }

    private async getCells(cellAddress: string, table: Table) {
        let cells = new Array<string>();
        let isRange = cellAddress.indexOf(":") > -1;
        if (!isRange) {
            for (let i = 0; i < table.rows.length; i++) {
                let row = table.rows[i];
                for (let j = 0; j < row.columns.length; j++) {
                    let column = row.columns[j];
                    if (column.orderBy.placeholder == cellAddress) {
                        let value = column.compiledValue;
                        if(value=="")
                            value = await this.compileFormula(column.value, table.name);
                        let columnValue = value;
                        cells.push(columnValue.toString());
                        return cells;
                    }
                }
            }
        } else {
            let from = cellAddress.split(":")[0];
            let to = cellAddress.split(":")[1];
            from = from.length == 1 ? from + "1" : from;
            to = to.length == 1 ? to + table.rows.length + 1 : to;

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

            for (let i = 0; i < table.rows.length; i++) {
                let row = table.rows[i];
                for (let j = 0; j < row.columns.length; j++) {
                    let column = row.columns[j];
                    let cellColumn = this.getNumberByChar(column.orderBy.placeholder.substr(0, 1));
                    let cellRow = parseInt(column.orderBy.placeholder.substr(1));
                    let isColumnInRange = false;
                    let isRowInRange = false;

                    if (columnDirection == 0) {
                        if (cellColumn >= fromColumnIndex && cellColumn <= toColumnIndex) {
                            isColumnInRange = true;
                        }
                    } else {
                        if (cellColumn <= fromColumnIndex && cellColumn >= toColumnIndex) {
                            isColumnInRange = true;
                        }
                    }

                    if (rowDirection == 0) {
                        if (cellRow >= fromRowIndex && cellRow <= toRowIndex) {
                            isRowInRange = true;
                        }
                    } else {
                        if (cellRow <= fromRowIndex && cellRow >= toRowIndex) {
                            isRowInRange = true;
                        }
                    }

                    if (isColumnInRange && isRowInRange) {
                        let value = column.compiledValue;
                        if(value=="")
                        value = await this.compileFormula(column.value, table.name);
                        let columnValue = value;
                        cells.push(columnValue);
                    }
                }
            }

        }

        return cells;
    }

    public getCharByNumber(index:number){
        return this.CHARACTERS[index];
    }
    
    private getNumberByChar(char: string) {
        return this.CHARACTERS.indexOf(char);
    }
}