import { Profile } from '@slack/web-api/dist/response/UsersProfileGetResponse'

export interface User {
    id: string
    mealsByWeek: number
    credits: number
    isSubscribed: boolean
    profile?: Profile
    pendingResponses: SentMessage[]
}

interface SentMessage {
    ts: string
    expectedResponseBy: number
}
