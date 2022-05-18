import path from 'path'

export const PATH = {
    USER_SAVE_PATH: path.join(__dirname, '../data/users.json'),
    MEAL_SAVE_PATH: path.join(__dirname, '../data/meals.json'),
    MEALSBYUSERS_SAVE_PATH: path.join(__dirname, '../data/MealsByUsers.json'),
    MEALSBYWEEK_SAVE_FOLDER_PATH: path.join(__dirname, '../data/meals/'),
}
