# dolphin

## Description

The app is available at https://t.me/eventizerbot

This is a mini app for Telegram designed to help you organize events, 
share them with your friends, and join events hosted by others.

Bot is accessible via inline mode to make it easy to share events in chats.

You can manage your events using the web app, which is accessible via the bot's menu button.

The app supports attachment menu.
When accessed from attachment menu, the app shows events list, that can be edited before sending to the chat.

If you click on a direct link to an event, 
you'll be able to see detailed information about that event and join it. 
If the event is already full, the app will notify you. 
Similarly, if you're already a participant in the event, 
the app will display a message and offer you a cancel button.

When you join an event, 
the bot automatically sends you a message containing all the details about the event.
## Tech stack

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vue.js](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)

## Setup telegram bot (both for local development and production)

Use [BotFather](https://t.me/botfather) to perform the following steps:
1. Create a new bot
2. Create mini app
3. Set URL. For development use `https://dolphin.dmku.local/`
4. Turn on inline mode for the bot
5. Setup menu button to open mini app. For development use `https://dolphin.dmku.local/`
6. Setup attachments menu for the bot. Ensure it enabled for all chat types
7. Set URL for the attachments' menu. For development use `https://dolphin.dmku.local/attach`

## Local development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/) (version 20 or higher)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### Running the bot locally

Since telegram requires to use HTTPS,
we need to configure it for local development using Caddy container.
The configuration file for Caddy is located in `Caddyfile.dev` file.

First create a volumes for Caddy and Postgres
```sh
docker volume create dolphin-caddy-data
docker volume create dolphin-pg-data-local
```

Then run the following command to start Caddy and Postgres containers
```sh
docker-compose -f docker-compose.dev.yaml up -d
```

### Frontend

Run frontend (Web App). Feel free to run it from your IDE.
```sh
cd apps/quiz-mini-app
yarn
yarn start:dev
```

### Backend

Go to backend directory `apps/dolphin-backend` and create `.env` file with the following variables:
```
TELEGRAM_BOT_TOKEN=<your telegram bot token>
TELEGRAM_MINI_APP_LINK=<your telegram mini app link> # e.g. t.me/usernamebot/app
ACCESS_TOKEN_SECRET=<your access token secret>
```

Prepare backend dependencies and database
```sh
cd apps/dolphin-backend
yarn
yarn schema:sync
yarn migration:up
```

Run backend. Feel free to run it from your IDE.
```sh
cd apps/dolphin-backend
yarn start:dev
```

### Setting up access via HTTPS

Follow the instructions in [Caddy documentation](https://caddyserver.com/docs/running#local-https-with-docker)
to set up certificates for local development.

Then add domain name `dolphin.dmku.local` to your `/etc/hosts` file or use any local DNS server.

### Telegram

Now you can use `dolphin.dmku.local` as a URL for your mini app in telegram.
In this case, it works only locally.

## Production

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the bot in production

Before running the bot, you need to create a `.env` file in the root directory of the project. This file should contain the following variables:
```
TELEGRAM_BOT_TOKEN=<your telegram bot token>
TELEGRAM_MINI_APP_LINK=<your telegram mini app link> # e.g. t.me/usernamebot/app
ACCESS_TOKEN_SECRET=<your access token secret>
POSTGRES_PASSWORD=<your postgres password>
```

If you want to use the bot in telegram test environment, you need to add the following variable:
```
TELEGRAM_TEST_ENVIRONMENT='true'
```

Create a volume for the postgres database and a network to connect the app and upstanding web server:
```sh
docker volume create dolphin-pg-data
docker network create dolphin
```

To run the bot, execute the following command:
```sh
docker-compose up -d
```

### Web server

This configuration implies that you have a web server running on the host machine that proxies requests to the bot and terminates TLS.
For example, you can use [Caddy](https://caddyserver.com/) for this purpose.

Use network `dolphin` to connect your web server to the bot. 
Bot will be available at `http://dolphin-entrypoint:3000` inside the network.

With Caddy you can use the following configuration:
```
<your domain> {
    reverse_proxy dolphin-entrypoint:3000
}
```

And Caddy will automatically generate and renew certificates for your domain using [Let's Encrypt](https://letsencrypt.org/).
