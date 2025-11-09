#  Booking API (Node.js + MySQL)

Минималистичный REST API для бронирования мест на мероприятие.
Реализовано на **Node.js + Express + MySQL**, без ORM, с авто-миграцией и сидером при запуске.

---

##  Возможности

-  Автоматическое создание таблиц (`events`, `bookings`) при старте
-  Автоматическая вставка тестовых событий, если их нет
-  Проверка, чтобы один пользователь не мог забронировать дважды
-  Проверка количества доступных мест
-  Получение информации о событии и количестве занятых мест

---

## Стек технологий

- **Node.js** (v18+)
- **Express.js** — для REST API
- **MySQL** — для хранения данных
- **dotenv** — для конфигурации
- **mysql2/promise** — для работы с БД

---

## Структура проекта

```bash
booking-api/
│
├── package.json
├── .env
├── src/
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   ├── migrate.js
│   ├── controllers/
│   │   └── bookingsController.js
│   └── routes/
│       └── bookings.js
└── README.md

```



---

##  Установка и запуск

### 1. Клонировать репозиторий
```bash
git clone https://github.com/yourname/booking-api.git
cd booking-api
```


### 2. Установить зависимости
```bash
npm install
```

### 3.Создайте файл .env в корне проекта:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=booking_db
DB_PORT=3306
PORT=3000
```

### Запуск сервера
```bash
npm start
```

### После запуска вы увидите:
```bash
 Проверка структуры БД...
 Таблицы проверены (созданы, если отсутствовали).
 Тестовые события добавлены.
 Server running on http://localhost:3000
```