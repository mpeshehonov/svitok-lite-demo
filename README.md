# СВИТОК ЛАЙТ — демо

Интерактивная демо-страница модуля **СВИТОК ЛАЙТ** для тестового задания AI Product Developer.

## Модуль

**СВИТОК ЛАЙТ** — универсальный анализ документов с автоматическими проверками, таблицами извлечённых полей и конкретными рекомендациями. Выбран потому, что три типа документов (счёт-фактура, акт, накладная) имеют единую структуру результата: это позволяет сделать все примеры глубокими и одинаково качественными, с наглядными статусами ✅ / ⚠️ / ❌.

## Стек

- Next.js 16 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- framer-motion
- ESLint + eslint-plugin-prettier (конфиг Prettier внутри ESLint)

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Сборка

```bash
npm run build
```

Статический экспорт попадает в папку `out/` — готово для Netlify (`publish = "out"` в `netlify.toml`).

## Линт и форматирование

```bash
npm run lint
npm run lint:fix
```
