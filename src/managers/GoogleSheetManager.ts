import fs from 'fs'
import { OAuth2Client } from 'google-auth-library'
import { google, sheets_v4 } from 'googleapis'
import { MealOrder, SheetCredit, Spreadsheet } from '../models/Spreadsheet'

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

const MAJOR_DIMENSION = 'rows'
const SEAZON_BOT_USERS_SPREADSHEET_RANGE = "'seazon-bot'"
const SEAZON_USERS_SPREADSHEET_RANGE = "'seazon'"

const USERNAME_ROW = 0
const CREDITS_ROW = 2
const CREDITS_COLUMN = (usernameColumn: number) => usernameColumn + 1

const ORDER_MEAL_START_DATE_COLUMN = 0
const ORDER_MEAL_END_DATE_COLUMN = 1
const ORDER_MEAL_COST_COLUMN = 2
const ORDER_MEAL_QUANTITY_COLUMN = 3

// const nb = 4;
// const euro = 5;

export interface GoogleSheetManager {
    // auth: OAuth2Client
    sheets: sheets_v4.Sheets
    listMoneyByUSer: () => Promise<SheetCredit[]>
}

export class GoogleSheetManager implements GoogleSheetManager {
    auth: OAuth2Client
    sheets: sheets_v4.Sheets

    constructor() {
        this.auth = new google.auth.OAuth2(
            process.env.GOOGLE_API_CLIENT_ID,
            process.env.GOOGLE_API_CLIENT_SECRET,
            'localhost'
        )
        // const auth = new google.auth.OAuth2(
        //     '105421802774914929331',
        //     process.env.GOOGLE_API_CLIENT_SECRET,
        //     'localhost'
        // )
        const token = fs.readFileSync(TOKEN_PATH)
        this.auth.setCredentials(JSON.parse(token.toString()))
        this.sheets = google.sheets({ version: 'v4', auth: this.auth })
    }

    initSheet = async () => {
        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: SEAZON_BOT_USERS_SPREADSHEET_RANGE,
            majorDimension: MAJOR_DIMENSION,
        })
    }

    appendCommand = async (rows: Spreadsheet) => {
        try {
            const result = {
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: "'seazon-bot'",
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: rows,
                },
            }
            const response = await this.sheets.spreadsheets.values.append(
                result
            )
            console.log('response', response)
        } catch (error) {
            console.log('error', error)
        }
    }

    listPreviousOrders = async (): Promise<MealOrder[]> => {
        let orders: MealOrder[] = []

        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: SEAZON_USERS_SPREADSHEET_RANGE,
            majorDimension: MAJOR_DIMENSION,
        })
        if (
            response &&
            response.data &&
            response.data.values &&
            response.data.values.length > 0
        ) {
            const seazonSheet = new Spreadsheet(
                response.data.values,
                MAJOR_DIMENSION
            )

            const startDateColumn = seazonSheet.column(
                ORDER_MEAL_START_DATE_COLUMN
            )
            const endDateColumn = seazonSheet.column(ORDER_MEAL_END_DATE_COLUMN)
            const costColumn = seazonSheet.column(ORDER_MEAL_COST_COLUMN)
            const quantityColumn = seazonSheet.column(
                ORDER_MEAL_QUANTITY_COLUMN
            )
            const orderSheet = new Spreadsheet(
                [startDateColumn, endDateColumn, costColumn, quantityColumn],
                'columns'
            )
            for (
                let rowIndex = 4;
                rowIndex < startDateColumn.length;
                rowIndex++
            ) {
                const currentRow = orderSheet.row(rowIndex)
                const isAValidORder = currentRow.every((cell) => cell !== '')
                if (isAValidORder) {
                    const newOrder: MealOrder = {
                        startDate: currentRow[ORDER_MEAL_START_DATE_COLUMN],
                        endDate: currentRow[ORDER_MEAL_END_DATE_COLUMN],
                        cost: currentRow[ORDER_MEAL_COST_COLUMN],
                        quantity: currentRow[ORDER_MEAL_QUANTITY_COLUMN],
                    }
                    // orders.push(newOrder) ; equivalent to line below
                    orders = [...orders, newOrder]
                }
            }
        }
        return orders
    }
    listMoneyByUSer = () => {
        return new Promise<SheetCredit[]>((resolve, reject) => {
            this.sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    range: SEAZON_USERS_SPREADSHEET_RANGE,
                    majorDimension: MAJOR_DIMENSION,
                },
                (err, res) => {
                    if (err) return reject(err)
                    if (res && res.data && res.data.values) {
                        const sheet = new Spreadsheet(
                            res.data.values,
                            MAJOR_DIMENSION
                        )
                        if (sheet.length) {
                            // filter users and their credits
                            const users = sheet
                                .row(USERNAME_ROW)
                                .reduce<number[]>((users, _, index) => {
                                    if (index % 2 === 0) {
                                        users.push(index)
                                    }
                                    return users
                                }, [])
                                .map(makeUser(sheet))
                            resolve(users)
                        } else {
                            reject(new Error('No data found.'))
                        }
                    }
                }
            )
        })
    }
}

const makeUser =
    (spreadsheet: Spreadsheet) =>
    (userID: number): SheetCredit => {
        const currentUserCreditColumn = CREDITS_COLUMN(userID)
        const username: string = spreadsheet.value(USERNAME_ROW, userID)
        const credits: number = spreadsheet.value(
            CREDITS_ROW,
            currentUserCreditColumn
        )
        // push the user and its credits to the array
        return { username, credits }
    }

async function updateValues(
    spreadsheetId: string,
    range: string,
    valueInputOption: object,
    _values: number
) {
    const { GoogleAuth } = require('google-auth-library')
    const { google } = require('googleapis')

    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/spreadsheet',
    })

    const service = google.sheets({ version: 'v4', auth })
    let values = [
        [
            // Cell values ...
        ],
        // Additional rows ...
    ]
    const resource = {
        values,
    }
    try {
        const result = await service.spreadsheets.values.update({
            spreadsheetId: range,
            valueInputOption,
            resource,
        })
        console.log('%d cells updated.', result.data.updatedCells)
        return result
    } catch (err) {
        // TODO (Developer) - Handle exception
        throw err
    }
}
