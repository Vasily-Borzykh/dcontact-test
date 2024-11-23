## Шаги для настройки и запуска

### 1. Получите API-ключ для работы с Google Sheets

1. Войдите в [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте новый проект:
   - Перейдите в "IAM & Admin" -> "Create a new project".
3. Включите API Google Sheets:
   - Перейдите в "API & Services" -> "Library".
   - Найдите "Google Sheets API" и включите его.
4. Создайте сервисный аккаунт:
   - Перейдите в "IAM & Admin" -> "Service accounts".
   - Нажмите "Create service account" и следуйте инструкциям.
   - Скачайте JSON-файл с ключами для сервисного аккаунта.
5. Укажите путь к JSON-файлу в переменной среды `GOOGLE_APPLICATION_CREDENTIALS`:
   
   В командной строке выполните команду (замените `путь/к/ключу.json` на путь к вашему JSON-файлу):
   
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="путь/к/ключу.json"
6. Запустите проект
   ```bash
   index.js
