import { Spreadsheet } from '../models/Spreadsheet'
import { User } from '../models/User'

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
