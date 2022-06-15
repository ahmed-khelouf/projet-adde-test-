export class Spreadsheet<T = any> extends Array<Array<T>> {
    majorDimension: 'rows' | 'columns'
    constructor(
        content: Array<Array<T>> | number,
        majorDimension: 'rows' | 'columns' = 'rows'
    ) {
        super()
        if (typeof content !== 'number') {
            content.forEach((row, index) => {
                this[index] = row
            })
        }
        this.majorDimension = majorDimension
    }

    row = (rowIndex: number): Array<T> => {
        switch (this.majorDimension) {
            case 'rows':
                return this[rowIndex]
            case 'columns':
                return new Array(...super.map((column) => column[rowIndex]))
        }
    }

    column = (columnIndex: number): Array<T> => {
        switch (this.majorDimension) {
            case 'rows':
                return new Array(...super.map((column) => column[columnIndex]))
            case 'columns':
                return this[columnIndex]
        }
    }

    value = (rowIndex: number, columnIndex: number): T => {
        switch (this.majorDimension) {
            case 'rows':
                return this[rowIndex][columnIndex]
            case 'columns':
                return this[columnIndex][rowIndex]
        }
    }
}
