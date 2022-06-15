import fs from 'fs'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { Spreadsheet } from '../models/Spreadsheet'
import { SheetCredit } from '../models/User'

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'
const SEAZON_USERS_SPREADSHEET_RANGE = "'seazon'"

const USERNAME_ROW = 0
const CREDITS_ROW = 2
const CREDITS_COLUMN = (usernameColumn: number) => usernameColumn + 1

export interface GoogleSheetManager {
    auth: OAuth2Client
    listMoneyByUSer: () => Promise<SheetCredit[]>
}
interface MealOrder {
    startDate: string
    endDate: string
    cost: number
    quantity: number
}

export class GoogleSheetManager implements GoogleSheetManager {
    auth: OAuth2Client

    constructor() {
        this.auth = new google.auth.OAuth2(
            process.env.GOOGLE_API_CLIENT_ID,
            process.env.GOOGLE_API_CLIENT_SECRET,
            'localhost'
        )
        const token = fs.readFileSync(TOKEN_PATH)
        this.auth.setCredentials(JSON.parse(token.toString()))
    }

    listPreviousOrders = async (): Promise<MealOrder[]> => {
        const sheets = google.sheets({ version: 'v4', auth: this.auth })
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: SEAZON_USERS_SPREADSHEET_RANGE,
        })
        if (res && res.data && res.data.values) {
            const sheet = new Spreadsheet(
                res.data.values,
                majorDimension
            )
        return []
    }
    listMoneyByUSer = () => {
        return new Promise<SheetCredit[]>((resolve, reject) => {
            const majorDimension = 'rows'
            const sheets = google.sheets({ version: 'v4', auth: this.auth })
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    range: SEAZON_USERS_SPREADSHEET_RANGE,
                    majorDimension,
                },
                (err, res) => {
                    if (err) return reject(err)
                    if (res && res.data && res.data.values) {
                        const sheet = new Spreadsheet(
                            res.data.values,
                            majorDimension
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

const getValueByColumnAndRow = () => {}
const getValueByRowAndColumn = () => {}
