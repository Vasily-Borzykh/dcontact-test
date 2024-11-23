const axios = require('axios');
const { google } = require('googleapis');

// Настройки
const API_BASE_URL = 'http://94.103.91.4:5000';
const GOOGLE_SHEET_ID = '1CAuLq4jFILog_Jj2cteA58gVA7108cyKvTMove4N21g';  // ID таблицы
const GOOGLE_SHEET_RANGE = 'Sheet1!A1';  // диапазон для записи данных в таблицу

// Генерация уникального имени пользователя
function generateUniqueUsername() {
    const timestamp = Date.now();  // Получаем текущее время в миллисекундах
    const randomString = Math.random().toString(36).substring(2, 15);  // Генерируем случайную строку
    return `user_${timestamp}_${randomString}`;  // Возвращаем уникальное имя
}

// Функция для создания пользователя
async function createUser(username) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/registration`, { username });
        console.log('User created', response.data);
    } catch (error) {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
    }
}

// Функция для авторизации пользователя
async function loginUser(username) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { username });
        return response.data.token;  // Возвращаем токен
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
    }
}

// Функция для получения данных о клиентах
async function getClients(token) {
    console.log('Bearer token:', token);
    try {
        const response = await axios.get(`${API_BASE_URL}/clients`, {
            headers: {
                Authorization: `${token}`,
            },
            params: {
                limit: 1000,
            },
        });
        return response.data;  // Возвращаем данные клиентов
    } catch (error) {
        console.error('Error getting clients:', error.response ? error.response.data : error.message);
    }
}

// Функция для записи данных в Google Таблицу
async function writeToGoogleSheet(data) {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'dcontact_sheet.json',  // Путь к файлу сервисного аккаунта
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const values = data.map(client => [
        client.id,
        client.firstName,
        client.lastName,
        client.gender,
        client.address,
        client.city,
        client.phone,
        client.email,
        client.status
    ]);

    const request = {
        spreadsheetId: GOOGLE_SHEET_ID,
        range: GOOGLE_SHEET_RANGE,
        valueInputOption: 'RAW',
        resource: {
            values,
        },
    };

    try {
        const response = await sheets.spreadsheets.values.update(request);
        console.log('Data written to Google Sheet:', response.data);
    } catch (error) {
        console.error('Error writing to Google Sheet:', error.message);
    }
}

async function main() {
    const username = generateUniqueUsername();

    await createUser(username);
    const token = await loginUser(username);
    if (token) {
        const clients = await getClients(token);
        if (clients && clients.length > 0) {
            await writeToGoogleSheet(clients);
        }
    }
}

main();
