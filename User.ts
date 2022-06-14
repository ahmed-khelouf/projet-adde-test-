import { Profile } from '@slack/web-api/dist/response/UsersProfileGetResponse'

export interface USER{
    username: string
    credits:number
    mealsByWeek : number
}


export interface SheetCredit {
    username?: string
    credits: number
}

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
