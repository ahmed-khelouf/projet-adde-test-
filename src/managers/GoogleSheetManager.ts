import fs from 'fs'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { SheetCredit } from '../models/User'

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'
const SEAZON_USERS_SPREADSHEET_RANGE = "'seazon'!E1:X4"

export interface GoogleSheetManager {
    auth: OAuth2Client
    listMoneyByUSer: () => Promise<SheetCredit[]>
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

    listMoneyByUSer = () => {
        return new Promise<SheetCredit[]>((resolve, reject) => {
            const sheets = google.sheets({ version: 'v4', auth: this.auth })
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.GOOGLE_SHEET_ID,
                    range: SEAZON_USERS_SPREADSHEET_RANGE,
                    majorDimension: 'columns',
                },
                (err, res) => {
                    if (err) return reject(err)
                    if (res && res.data && res.data.values) {
                        const columns = res.data.values
                        if (columns.length) {
                            // filter users and their credits
                            const users = columns.reduce<SheetCredit[]>(
                                (
                                    currentCredit,
                                    column,
                                    index,
                                    parsedColumns
                                ) => {
                                    // if index is even, it's a user; its credits is in the next column
                                    if (index % 2 === 0) {
                                        const username: string = column[0]
                                        const credits: number =
                                            parsedColumns[index + 1][2]
                                        // push the user and its credits to the array
                                        return [
                                            ...currentCredit,
                                            { username, credits },
                                        ]
                                    }
                                    // continue to next column
                                    return currentCredit
                                },
                                []
                            )
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
