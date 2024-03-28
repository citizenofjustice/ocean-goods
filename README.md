# OceanGoods [![Static Badge](https://img.shields.io/badge/Open_website-grey)](https://ocean-goods.ru)

A full-stack e-commerce website for selling fish products built with [![Static Badge](https://img.shields.io/badge/PostgreSQL-%2331648c)]() ![Static Badge](https://img.shields.io/badge/Express-%237e7e7e) ![Static Badge](https://img.shields.io/badge/React-%23149eca) and ![Static Badge](https://img.shields.io/badge/Node-%23417e38).

## Features
  - **JWT cookie authentication:** Utilizes JSON Web Tokens for secure data transmission with expiration times and httpOnly.
  - **Restricted access for guests and for users without required privileges:** Protected routes on the client with redirect to auth page (if user is not logged in) and on the server with privileges verification on private routes (if access denied redirect user to access denied page on the client).
  - **Responsive and Interactive UI:** Responsive layout for different screen sizes and interactivity for enhanced user experience.
  - **Use of Telegram Bot API:** Telegraf.js used for sending messages to specified telegram chat when orders are made. It provides additional ways of tracking the orders besides the dedicated website section.
  - **Infinite scroll:** Loading catalog items and orders with Tanstack useInfiniteQuery.
  - **Image converter for uploaded images:** Optimization of images by converting to .webp format and resizing large images.
  - **Lazy loading of images:** Optimizing initial load times with lazy loading of images when scrolling through the catalog.
  - **Form validation:** Validation of forms with Zod - TypeScript-first schema validation.
  - **MobX state management:** Allows for dynamic state changes across the app without prop drilling.

## Tech
  - [React](https://react.dev)
  - [Node.js](https://nodejs.org)
  - [Express.js](https://expressjs.com)
  - [PostgreSQL](https://www.postgresql.org)
  - [Prisma](https://www.prisma.io)
  - [Telegraf](https://telegraf.js.org)
  - [MobX](https://mobx.js.org)
  - [Shadcn UI](https://ui.shadcn.com)
  - [Tailwind CSS](https://tailwindcss.com)
  - [Vite](https://vitejs.dev)
  - [Nginx](https://nginx.org)

## Environment Variables
  To run this project, you will need to add the following environment variables to your .env files in both client and server directories.

#### client/.env

  file names:
    - .env.production for deployment build
    - .env.development for dev environment
  
  ```
  # Variable for requests to the server (replace with http://localhost:port/api for dev environment)
  VITE_BASE_URL="https://server.your-site.com/api"
  # Variable for image paths (replace with http://localhost:port for dev environment)
  VITE_SERVER_URL="https://server.your-site.com/"
  
  # Variable for head <title> of pages
  VITE_MAIN_TITLE="value represents the title of the overall HTML document"
  
  # Number on contact page
  VITE_CONTACT="8-999-999-99-99 (Owner name)"
  ```

#### server/.env

  ```
  # For creating and verifying access token
  ACCESS_TOKEN_SECRET=...
  # For creating and verifying refresh token
  REFRESH_TOKEN_SECRET=...

  # Your Telegram Bot API key
  TELEGRAM_BOT_API_KEY=...
  # Your Telegram chat id
  TELEGRAM_CHAT_ID=-9999999999

  # Prisma ORM database connection URL
  DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=myschema"

  # Default admin user email
  ADMIN_EMAIL="Example@example.com"
  # Default admin user password (should consist of latin letters of both registers, symbols and numbers and at least 8 characters long)
  ADMIN_PASSWORD="!Some7?Pass8word="
  ```
