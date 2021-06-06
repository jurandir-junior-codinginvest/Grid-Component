import { Injectable } from "@angular/core";
import { Table } from "../class/Table";

@Injectable()
export class PaginationService {
    private tableSelected!: Table;

    constructor() {
    }

    public init(tableSelected: Table) {
        this.tableSelected = tableSelected;
    }

    public selectedTake(itemValue: string, currentTake: number) {
        let selectedTake = parseInt(itemValue);
        return selectedTake == currentTake;
    }

    public setPage(page: number) {
        if (this.tableSelected) {
            this.tableSelected.page = page;
        }
    }

    public allowGoToStart() {
        if (this.tableSelected) {
            return this.tableSelected.page > 4;
        }
        return false;
    }

    public allowGoBack() {
        if (this.tableSelected) {
            return this.tableSelected.page > 3;
        }
        return false;
    }

    public allowGoNext() {
        if (this.tableSelected) {
            let take = this.getCurrentTake();
            return this.tableSelected.page < (take - 1);
        }
        return false;
    }

    public allowGoToEnd() {
        if (this.tableSelected) {
            let take = this.getCurrentTake();
            return this.tableSelected.page < (take - 2);
        }
        return false;
    }

    public getPreviewPage() {
        if (this.tableSelected) {
            let previewsPage = [];
            let pageTakeDifference = this.tableSelected.take - this.tableSelected.page;
            let difference = 2 - pageTakeDifference;
            difference = difference < 0 ? 0 : difference;
            let previewDifference = this.tableSelected.page - (3 + difference);

            let page = this.tableSelected.page;
            if (page > 1) {
                for (let i = page; i > previewDifference; i--) {
                    if (page - i > 0 && (page - i) + previewDifference > 0)
                        previewsPage.push((page - i) + previewDifference);
                }
            }
            return previewsPage;
        }
        return new Array<number>();
    }

    public getNextPage() {
        if (this.tableSelected) {
            let take = this.getCurrentTake();
            let nextDifference = this.tableSelected.page + 2;
            if (this.tableSelected.page < 4)
                nextDifference = 5;
            let nextPage = [];
            for (let i = this.tableSelected.page; i < nextDifference; i++) {
                if (i <= take)
                    nextPage.push(i + 1);
            }
            return nextPage;
        }
        return new Array<number>();
    }

    public getTo() {
        if (this.tableSelected) {
            return ((this.tableSelected.page * this.tableSelected.take) > this.tableSelected.rows.length) ? this.tableSelected.rows.length : this.tableSelected.page * this.tableSelected.take;
        }
        return 0;
    }

    public getFrom() {
        if (this.tableSelected) {
            return this.tableSelected.page == 1 ? 1 : (((this.tableSelected.page - 1) * this.tableSelected.take) + 1);
        }
        return 0;
    }

    private getCurrentTake() {
        if (this.tableSelected) {
            return (this.tableSelected.rows.length / this.tableSelected.take) - 1;
        }
        return 0;
    }
}