# 🍔 Infinity — Онлайн-заказ еды

**Infinity** — это современный веб-сервис для заказа еды с доставкой. Полностью функциональное решение с админ-панелью, онлайн-оплатой и автоматической отправкой писем клиентам.

---

## 📋 О проекте

Платформа позволяет пользователям:
- Просматривать меню с категориями и детализацией товаров
- Формировать корзину и оформлять заказы
- Оплачивать онлайн через Stripe
- Получать автоматические письма с подтверждением заказа и оплаты

Администраторы могут:
- Управлять товарами и категориями
- Просматривать заказы и статистику
- Менять статусы заказов

---

## 🚀 Возможности

### Для клиентов
- ✅ Каталог товаров с категориями
- ✅ Корзина с динамическим подсчётом
- ✅ Оформление заказа с выбором способа доставки
- ✅ Онлайн-оплата через Stripe (карты, Apple Pay, Google Pay)
- ✅ История заказов в личном кабинете
- ✅ Автоматические email-уведомления

### Для администраторов
- ✅ Дашборд с метриками (заказы, пользователи, товары)
- ✅ CRUD товаров (создание, редактирование, удаление)
- ✅ Управление категориями
- ✅ Управление заказами (просмотр, смена статуса)
- ✅ Авторизация по токенам

---

## 🛠️ Технологии

| Frontend | Backend | Database | Services |
|----------|---------|----------|----------|
| React 18 | Node.js | PostgreSQL | Stripe (оплата) |
| TypeScript | Express | Prisma ORM | Brevo (email) |
| Vite | JWT | | Cloudinary (изображения) |
| TailwindCSS | CORS, CookieParser | | |
| React Router | | | |
| Axios | | | |

---

## 📦 Установка

### 1. Клонировать репозиторий
```bash
git clone https://github.com/your-username/infinity.git
cd infinity
```

### 2. Настроить сервер
```bash
cd server
npm install
cp .env.example .env
# Отредактируйте .env (см. раздел Environment Variables)
npm run dev
```

### 3. Настроить клиент
```bash
cd client
npm install
cp .env.example .env
# Отредактируйте .env
npm run dev
```

### 4. Запустить базу данных
```bash
# В папке server
npx prisma migrate dev
npx prisma db seed
```

---

## 🔧 Environment Variables

### server/.env
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin-password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Brevo
BREVO_API_KEY="xsmtpsib-..."
EMAIL_FROM="noreply@example.com"
```

### client/.env
```env
VITE_BACKEND_URL="http://localhost:4000"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 📁 Структура проекта

```
infinity/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Переиспользуемые компоненты
│   │   ├── pages/          # Страницы приложения
│   │   │   ├── admin/      # Страницы админки
│   │   │   └── ...
│   │   ├── context/        # AppContext (глобальное состояние)
│   │   ├── types.ts        # TypeScript типы
│   │   └── App.tsx         # Роутинг
│   └── ...
├── server/                 # Express backend
│   ├── controllers/        # Бизнес-логика
│   ├── routes/             # API маршруты
│   ├── middleware/         # Auth, adminAuth
│   ├── lib/                # Stripe, Brevo, Prisma
│   ├── prisma/             # Схема БД
│   └── server.ts           # Точка входа
└── README.md
```

---

## 🌐 Роуты API

### Товары
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/product/list` | Список товаров |
| POST | `/api/product/add` | Добавить товар (admin) |
| POST | `/api/product/remove` | Удалить товар (admin) |
| POST | `/api/product/add-category` | Добавить категорию (admin) |
| GET | `/api/product/list-categories` | Список категорий |

### Заказы
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/order/place` | Оформить заказ |
| POST | `/api/order/pay` | Создать PaymentIntent (Stripe) |
| POST | `/api/order/webhook/stripe` | Webhook Stripe |
| GET | `/api/order/list` | Все заказы (admin) |
| POST | `/api/order/status` | Обновить статус (admin) |

### Корзина
| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/cart/get` | Получить корзину |
| POST | `/api/cart/add` | Добавить в корзину |
| POST | `/api/cart/remove` | Удалить из корзины |

### Авторизация
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/user/login` | Вход пользователя |
| POST | `/api/user/register` | Регистрация |
| GET | `/api/user/isAuth` | Проверка авторизации |
| POST | `/api/admin/login` | Вход админа |
| GET | `/api/admin/check` | Проверка админа |

---

## 📸 Скриншоты

### Главная страница
![Home](https://via.placeholder.com/800x450?text=Main+Page)

### Корзина
![Cart](https://via.placeholder.com/800x450?text=Cart)

### Админ-панель
![Admin](https://via.placeholder.com/800x450?text=Admin+Dashboard)

### Оформление заказа
![Checkout](https://via.placeholder.com/800x450?text=Checkout)

---

## 📊 Статистика проекта

- ⏱️ **Время разработки:** 3 недели
- 📦 **Товаров в каталоге:** 20+
- 🧩 **Компонентов:** 25+
- 📄 **Страниц:** 10+
- 🔐 **Роутов API:** 30+

---

## 🤝 Вклад

Приветствуются пул-реквесты! Для крупных изменений откройте issue сначала.

1. Форкните проект
2. Создайте ветку (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Пушните в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📝 Лицензия

MIT License.

---

## 👨‍💻 Автор

**Katrin** — [GitHub](https://github.com/your-username) — [Email](mailto:your-email@example.com)

---

## 🙏 Благодарности

- [React](https://react.dev/) — UI библиотека
- [Stripe](https://stripe.com/) — Платёжная система
- [Brevo](https://www.brevo.com/) — Email-сервис
- [Cloudinary](https://cloudinary.com/) — Хранение изображений
- [Prisma](https://www.prisma.io/) — ORM

---

## 📞 Контакты

Если у вас есть вопросы или предложения — создавайте issue или пишите на email.

**Проект разработан для портфолио** 🚀
