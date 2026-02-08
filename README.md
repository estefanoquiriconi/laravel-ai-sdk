# Laravel AI SDK + Inertia React Starter

A Laravel 12 application with Inertia.js (React) and the Laravel AI SDK. It includes Fortify authentication, a settings area, and a streaming AI chat sidebar powered by an agent.

## Features

- Laravel 12 backend with Fortify auth and Inertia.js v2 (React)
- Streaming AI chat widget (authenticated users) using Laravel AI SDK + @laravel/stream-react
- Wayfinder for typed route helpers in the frontend
- Tailwind CSS v4 UI with Radix UI and Headless UI components

## Tech Stack

- PHP 8.x, Laravel 12
- Inertia.js v2 + React 19
- Tailwind CSS v4 + Vite
- Laravel AI SDK
- Pest for tests

## Requirements

- PHP 8.2+ (project guidelines target 8.4)
- Composer
- Node.js + npm
- SQLite (default) or another supported database

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
```

Or use the provided setup script:

```bash
composer run setup
```

## Running Locally

```bash
composer run dev
```

This starts:

- `php artisan serve`
- `php artisan queue:listen`
- `php artisan pail`
- `npm run dev`

If you prefer separate terminals:

```bash
php artisan serve
php artisan queue:listen --tries=1 --timeout=0
npm run dev
```

## AI Configuration

The default AI providers are configured in `config/ai.php`. The customer support chat agent uses the Gemini provider, so you need at least:

```
GEMINI_API_KEY=your_key
```

You can also configure other providers (OpenAI, Anthropic, etc.) in `.env.example` and `config/ai.php`.

## Chat Streaming

- Backend endpoint: `POST /chat/stream` (requires authenticated + verified user)
- UI: floating chat panel in the app layout
- Conversations are stored in `agent_conversations` and `agent_conversation_messages`

## Useful Commands

```bash
# Lint PHP
composer run lint

# Run tests (includes lint)
composer run test

# Typecheck frontend
npm run types

# Lint frontend
npm run lint

# Format frontend
npm run format
```

## Project Structure

- `app/Ai/Agents` – AI agents (e.g., CustomerSupport)
- `app/Http/Controllers` – controllers, including chat streaming
- `resources/js` – Inertia React pages/components
- `routes` – web routes + settings routes
- `database/migrations` – schema, including AI conversation tables

## Notes

- Default DB is SQLite (see `.env.example`).
- If frontend changes are not visible, run `npm run dev` or `npm run build`.
