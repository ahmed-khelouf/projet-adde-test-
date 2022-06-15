import { Spreadsheet } from './models/Spreadsheet'

const rowSheet = new Spreadsheet([
    ['pomme', 'poire', 'fraise'],
    ['voiture', 'bélier', 'chambre'],
    ['Messi', 'Mbappe', 'Neymar'],
])
const columnSheet = new Spreadsheet(
    [
        ['pomme', 'voiture', 'Messi'],
        ['poire', 'bélier', 'Mbappe'],
        ['fraise', 'chambre', 'Neymar'],
    ],
    'columns'
)

// type Dimension = any[]
// type Columns = Dimension
// type Rows = Dimension

// Dimension.prototype.row = function (rowIndex: number): any {
//     return this[rowIndex]
// }

console.log('rowSheet', rowSheet.value(1, 2))
console.log('columnSheet', columnSheet.value(1, 2))

