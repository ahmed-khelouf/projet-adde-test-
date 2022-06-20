import { Spreadsheet } from './models/Spreadsheet'
import { createCommandRow } from './utils/GoogleSheetManager+utils'

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

// console.log('rowSheet', rowSheet.value(1, 2))
// console.log('columnSheet', columnSheet.value(1, 2))

const uneLigne = createCommandRow({
    startDate: '2022/05/22',
    endDate: '2022/05/22',
    cost: 100,
    mealQuantity: 24,
    users: [],
})

console.log('ma ligne: ', uneLigne[0].join(' | '))
