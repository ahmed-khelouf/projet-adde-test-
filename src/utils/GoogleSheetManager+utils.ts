import { Spreadsheet } from '../models/Spreadsheet'
import { User } from '../models/User'

const AUTOMATIC_COMMAND_COST_PER_USER =
    '=IFNA(MULTIPLY(VLOOKUP(INDIRECT(ADDRESS(ROW();COLUMN()-2;4));CommandeGlobale;5; FALSE);INDIRECT(ADDRESS(ROW();COLUMN()-1;4))); 0)'
interface SeazonOrder {
    startDate: string
    endDate: string
    mealQuantity: number
    cost: number
    users: User[]
}

export const createCommandRow = (newOrder: SeazonOrder): Spreadsheet => {
    const commandRow: any[] = [
        newOrder.startDate,
        newOrder.endDate,
        newOrder.cost,
        newOrder.mealQuantity,
    ]
    return new Spreadsheet([commandRow], 'rows')
}

interface SeazonCredit {
    startDate: any
}

export const createAdditionCredit = (newOrder: SeazonCredit): Spreadsheet => {
    const creditRow: any[] = [newOrder.startDate]
    return new Spreadsheet([creditRow], 'rows')
}

interface UserSeazonMealOrder {
    date: string // 2020-01-01
    mealAmount: number // 1
}
export const createSeazonMealOrderRow = (
    newOrder: UserSeazonMealOrder
): Spreadsheet => {
    const { date, mealAmount } = newOrder
    return new Spreadsheet(
        [[date, mealAmount, AUTOMATIC_COMMAND_COST_PER_USER]],
        'rows'
    )
}
