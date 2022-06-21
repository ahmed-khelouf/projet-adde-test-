import { ModalView } from '@slack/bolt'
import { Meal } from './models/Meal'
import { User } from './models/User'
import {
    TEXT_WITH_IMAGE_BLOCK,
    TEXT_BLOCK,
    ACTION_BLOCK,
    CONTEXT_BLOCK,
    DIVIDER_BLOCK,
    MODAL_BLOCK,
    DATE_INPUT_BLOCK,
    TEXT_INPUT_BLOCK,
} from './utils/SlackBlockHelpers'

export const SEAZON_ATE_LUNCH_QUESTION = {
    blocks: [
        {
            type: 'section',
            text: {
                type: 'plain_text',
                text: 'Salut! est ce que tu as mangé un plats seazon ce midi?.',
                emoji: true,
            },
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: ':thumbsup: OUI',
                        emoji: true,
                    },
                    style: 'primary',
                    value: 'yes',
                    action_id: 'seazon_lunch_eat_yes_id',
                },
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: ':thumbsdown: NON',
                        emoji: true,
                    },
                    style: 'danger',
                    value: 'no',
                    action_id: 'seazon_lunch_eat_no_id',
                },
            ],
        },
    ],
}
// var file = require('../data/mealsS.json')

//console.log(file["results"][0]["menu"][2].meal.fridge)

export const SEAZON_GIVE_LUNCH = {
    blocks: [
        {
            type: 'divider',
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: '2123',
            },
            accessory: {
                type: 'image',
                image_url:
                    'https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg',
                alt_text: 'alt text for image',
            },
        },
        {
            type: 'divider',
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Je veux lui',
                        emoji: true,
                    },
                    value: 'click_me_123',
                },
            ],
        },
    ],
}

export const SEAZON_GIVE_LUNCH_STAT = {
    blocks: [
        {
            type: 'divider',
        },

        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Je veux lui',
                        emoji: true,
                    },
                },
            ],
        },
    ],
}

export const SEAZON_GIVE_LUNCH_DYN = {
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: '2123',
            },
            accessory: {
                type: 'image',
                image_url:
                    'https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg',
                alt_text: 'alt text for image',
            },
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Je veux lui',
                        emoji: true,
                    },
                    value: 'click_me_123',
                },
            ],
        },
        {
            dispatch_action: true,
            type: 'input',
            element: {
                type: 'plain_text_input',
                action_id: 'plain_text_input-action',
            },
            label: {
                type: 'plain_text',
                text: 'Label',
                emoji: true,
            },
        },
    ],
}

export const mealToBlock = (
    mealWeekDate: string,
    meal: Meal,
    users: Record<string, User>
) => {
    const orderedByUsers =
        meal.users?.map((userID) => users[userID]).filter((user) => user) || []
    return [
        TEXT_WITH_IMAGE_BLOCK(meal.name, meal.imageUrl),
        TEXT_BLOCK(meal.description),
        ACTION_BLOCK([
            {
                text: 'Je veux celui-ci',
                value: meal.id,
                id: `addMeal-${mealWeekDate}`,
            },
        ]),
        CONTEXT_BLOCK(orderedByUsers),
        DIVIDER_BLOCK,
    ]
}

export const OrderToModalView = (startDate: string): ModalView => {
    return MODAL_BLOCK('Nouvelle commande', 'SEAZON_ORDER', [
        TEXT_BLOCK('TODO:'),
        DIVIDER_BLOCK,
        DATE_INPUT_BLOCK(
            'startDate',
            'Date de début de commande (choisir le lundi):',
            startDate
        ),
        TEXT_INPUT_BLOCK('cost', 'coût (en euros):'),
        TEXT_INPUT_BLOCK('quantity', 'nombre de plats commandés:'),
    ])
}

export const OrderToModalViewCredit = (startDate: string): ModalView => {
    return MODAL_BLOCK('Ajouter des credits ', 'ORDER_SEAZON_CREDIT', [
        TEXT_BLOCK('toto:'),
        DIVIDER_BLOCK,
        DATE_INPUT_BLOCK(
            'startDate',
            'ajoute credit  (choisir le lundi):',
            startDate
        )
    ])
}

export const OrderToModalViewNb = (): ModalView => {
    return MODAL_BLOCK('nb plat de la semaine ', 'ORDER_SEAZON_NB', [
        TEXT_BLOCK('TODO:'),
        DIVIDER_BLOCK,
        
        TEXT_INPUT_BLOCK('nbPlat', 'nbPlat (par semaine):'),

    ])
}