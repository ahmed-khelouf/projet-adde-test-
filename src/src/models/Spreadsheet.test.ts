import { Spreadsheet } from './Spreadsheet'

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

describe('row Spreadsheet', () => {
    it('should get value at second row and third column', () => {
        expect(rowSheet.value(1, 2)).toBe('chambre')
    })
    it('should get value at third row and second column', () => {
        expect(rowSheet.value(2, 1)).toBe('Mbappe')
    })
    it('should get first row', () => {
        expect(rowSheet.row(0)).toStrictEqual(['pomme', 'poire', 'fraise'])
    })
    it('should get second row', () => {
        expect(rowSheet.row(1)).toStrictEqual(['voiture', 'bélier', 'chambre'])
    })
    it('should get first column', () => {
        expect(rowSheet.column(0)).toStrictEqual(['pomme', 'voiture', 'Messi'])
    })
})
describe('column Spreadsheet', () => {
    it('get value at second row and third column', () => {
        expect(columnSheet.value(1, 2)).toBe('chambre')
    })
    it('get value at third row and second column', () => {
        expect(columnSheet.value(2, 1)).toBe('Mbappe')
    })
    it('should get first row', () => {
        expect(columnSheet.row(0)).toStrictEqual(['pomme', 'poire', 'fraise'])
    })
    it('should get second row', () => {
        expect(columnSheet.row(1)).toStrictEqual([
            'voiture',
            'bélier',
            'chambre',
        ])
    })
    it('should get first column', () => {
        expect(columnSheet.column(0)).toStrictEqual([
            'pomme',
            'voiture',
            'Messi',
        ])
    })
})
