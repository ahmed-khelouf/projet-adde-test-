import {
    ActionsBlock,
    ContextBlock,
    DividerBlock,
    ImageElement,
    MrkdwnElement,
    PlainTextElement,
    SectionBlock,
} from '@slack/bolt'
import { User } from '../models/User'

interface SlackAction {
    id: string
    text: string
    value: string
}

export const DIVIDER_BLOCK: DividerBlock = {
    type: 'divider',
}

export const TEXT_BLOCK = (text: string): SectionBlock => ({
    type: 'section',
    text: {
        type: 'mrkdwn',
        text,
    },
})

export const TEXT_WITH_IMAGE_BLOCK = (
    text: string,
    imageUrl: string
): SectionBlock => ({
    type: 'section',
    text: {
        type: 'mrkdwn',
        text,
    },
    accessory: {
        type: 'image',
        image_url: imageUrl,
        alt_text: text,
    },
})

export const ACTION_BLOCK = (actions: SlackAction[]): ActionsBlock => ({
    type: 'actions',
    elements: actions.map((action) => ({
        type: 'button',
        text: {
            type: 'plain_text',
            text: action.text,
            emoji: true,
        },
        value: action.value,
        action_id: action.id,
    })),
})

export const CONTEXT_BLOCK = (orderingUsers: User[]): ContextBlock => {
    const votedUsers: (ImageElement | PlainTextElement | MrkdwnElement)[] =
        orderingUsers.map((user) => ({
            type: 'image',
            image_url: user.profile?.image_48 || '',
            alt_text: user.profile?.display_name_normalized || '???',
        }))
    votedUsers.push({
        type: 'plain_text',
        emoji: true,
        text: voteToString(orderingUsers.length),
    })
    return {
        type: 'context',
        elements: votedUsers,
    }
}

const voteToString = (vote: number): string =>
    `${vote} vote${vote > 1 ? 's' : ''}`
