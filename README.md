# СВИТОК ЛАЙТ — демо

Интерактивная демо-страница модуля **СВИТОК ЛАЙТ** для тестового задания AI Product Developer.

## Модуль

**СВИТОК ЛАЙТ** — универсальный анализ документов с автоматическими проверками, таблицами извлечённых полей и конкретными рекомендациями. Выбран потому, что три типа документов (счёт-фактура, акт, накладная) имеют единую структуру результата: это позволяет сделать все примеры глубокими и одинаково качественными, с наглядными статусами ✅ / ⚠️ / ❌.

## Стек

- Next.js 16 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- framer-motion
- Netlify Functions + Google Gemini 2.0 Flash
- ESLint + eslint-plugin-prettier (конфиг Prettier внутри ESLint)

## Запуск

```bash
npm install
cp .env.example .env
# вставь GEMINI_API_KEY в .env
npm run dev:netlify
```

Откройте [http://localhost:8888](http://localhost:8888).

`npm run dev` запускает только фронт — загрузка своих документов работает через `dev:netlify`, потому что API живёт в Netlify Function.

## Переменные окружения

| Переменная | Где | Описание |
|---|---|---|
| `GEMINI_API_KEY` | `.env` локально, Netlify env в проде | Ключ из [Google AI Studio](https://aistudio.google.com/apikey) |

## Сборка

```bash
npm run build
```

Статический экспорт попадает в папку `out/`. Netlify собирает сайт и функцию `analyze` из `netlify/functions/`.

## Линт и форматирование

```bash
npm run lint
npm run lint:fix
```

## Загрузка документов

- Поддерживаются PDF, JPG, PNG, WebP до 10 МБ
- Файл отправляется в Netlify Function → Gemini API
- Ключ хранится только на сервере, не во фронте
- Hardcoded-примеры продолжают работать без API
