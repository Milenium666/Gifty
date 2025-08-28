# Модульная архитектура Gift Helper

## Описание

Gift Helper — современное Angular-приложение для подбора подарков с фильтрацией, авторизацией и избранным. Данные хранятся в Firestore, поддерживаются unit - тесты.

## Стек технологий

- Angular 20
- Nx workspace
- TypeScript
- Jest (unit-тесты)
- Firestore (backend)
- Less (стили)

## Основные команды

- Сборка: `nx build`
- Запуск: `nx serve`
- Seed Firestore:
  ```
  FIREBASE_SERVICE_ACCOUNT_PATH=~/Документы/T-Bank/firebase_admin/service-account.json npx ts-node --project tsconfig.tools.json tools/seed-firestore.ts
  ```

## Как запустить

1. Установите зависимости:
    ```
    npm install
    ```
2. Запустите локальный сервер:
    ```
    nx serve
    ```
3. Запустите unit-тесты:
    ```
    nx test
    ```
4. Для наполнения Firestore:
    ```
    FIREBASE_SERVICE_ACCOUNT_PATH=~/Документы/T-Bank/firebase_admin/service-account.json npx ts-node --project tsconfig.tools.json tools/seed-firestore.ts
    ```

## Тестирование

- Unit-тесты покрывают утилиты

## Контакты

Автор: Падун Елена

## Структура проекта

```
src/app/
├── core/                    # Общие сервисы, интерфейсы, утилиты
│   ├── services/           # Бизнес-логика сервисы
│   ├── interfaces/         # TypeScript интерфейсы
│   ├── guards/            # Route guards
│   ├── interceptors/      # HTTP interceptors
│   └── utils/             # Утилиты и хелперы
├── shared/                 # Переиспользуемые компоненты
│   ├── components/        # UI компоненты
│   ├── directives/        # Кастомные директивы
│   ├── pipes/            # Кастомные пайпы
│   └── models/           # Общие модели
├── modules/               # Функциональные модули
│   ├── auth/             # Модуль аутентификации
│   │   ├── components/   # Компоненты аутентификации
│   │   ├── services/     # Сервисы аутентификации
│   │   └── guards/       # Guards для аутентификации
│   ├── gifts/            # Модуль подарков
│   │   ├── components/   # Компоненты подарков
│   │   ├── services/     # Сервисы подарков
│   │   └── models/       # Модели подарков
│   └── favorites/        # Модуль избранного
│       ├── components/   # Компоненты избранного
│       └── services/     # Сервисы избранного
└── layout/               # Компоненты макета
    ├── header/           # Компонент заголовка
    ├── footer/           # Компонент подвала
    └── navigation/       # Компоненты навигации
```

## Принципы архитектуры

### 1. **Core** - Ядро приложения
- **services/**: Бизнес-логика, API сервисы, Firebase сервисы
- **interfaces/**: TypeScript интерфейсы и типы
- **guards/**: Route guards для защиты маршрутов
- **interceptors/**: HTTP interceptors для обработки запросов
- **utils/**: Утилиты, хелперы, константы

### 2. **Shared** - Переиспользуемые компоненты
- **components/**: UI компоненты (кнопки, инпуты, модалы)
- **directives/**: Кастомные директивы
- **pipes/**: Кастомные пайпы для трансформации данных
- **models/**: Общие модели данных

### 3. **Modules** - Функциональные модули
Каждый модуль содержит:
- **components/**: Компоненты, специфичные для модуля
- **services/**: Сервисы модуля
- **models/**: Модели данных модуля
- **guards/**: Guards для модуля (если нужны)

### 4. **Layout** - Компоненты макета
- **header/**: Заголовок с навигацией
- **footer/**: Подвал
- **navigation/**: Компоненты навигации

## Преимущества новой архитектуры

1. **Модульность**: Каждый функциональный блок изолирован
2. **Переиспользование**: Shared компоненты доступны везде
3. **Масштабируемость**: Легко добавлять новые модули
4. **Поддерживаемость**: Четкое разделение ответственности
5. **Тестируемость**: Изолированные модули легче тестировать

## Правила именования

- **Файлы**: kebab-case (например: `gift-list.ts`)
- **Классы**: PascalCase (например: `GiftListComponent`)
- **Переменные**: camelCase (например: `giftList`)
- **Константы**: UPPER_SNAKE_CASE (например: `MAX_GIFTS_COUNT`)

## Импорты

Используйте barrel файлы для импортов:
```typescript
// Вместо
import { ButtonComponent } from '../../shared/components/button/button';

// Используйте
import { ButtonComponent } from '../../shared/shared';
```
