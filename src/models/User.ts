import { Profile } from '@slack/web-api/dist/response/UsersProfileGetResponse'
import { SheetCredit } from './Spreadsheet'

export interface User extends SheetCredit {
    id: string
    mealsByWeek: number
    isSubscribed: boolean
    profile?: Profile
    pendingResponses: SentMessage[]
}

interface SentMessage {
    ts: string
    expectedResponseBy: number
}
