import { OrderBy as OrderByType } from "../enum/OrderBy";
import { OrderBy } from "../types/OrderBy";


export class Column {
    public name: string = "";
    public value: any;
    public compiledValue: string = "";
    public selected: boolean = false;
    public orderBy: OrderBy = { placeholder: "", orderByType: OrderByType.neutral };
}
