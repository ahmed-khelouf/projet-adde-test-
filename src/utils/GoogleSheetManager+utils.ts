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

interface SeazonCredit{
    startDate: any
}

export const createAdditionCredit = (newOrder: SeazonCredit ): Spreadsheet => {
    const creditRow: any[] = [
        newOrder.startDate
        
       
    ]
    return new Spreadsheet([creditRow], 'rows')
}


interface SeazonNb{
    nbPlat: any
}
export const createNb = (newOrder: SeazonNb ): Spreadsheet => {
    const nbRow: any[] = [
        newOrder.nbPlat
        
       
    ]
    return new Spreadsheet([nbRow], 'rows')
}