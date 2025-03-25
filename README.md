# CopperPayBot

CopperPayBot is a Telegram bot that allows users to manage their cryptocurrency wallets, perform transfers, and receive notifications for deposits.

## Features

- View all wallets
- Change default wallet
- View transaction history
- Perform email and wallet transfers
- Receive notifications for new deposits

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/copperpaybot.git
    cd copperpaybot
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Setup

1. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    COPPERX_API_ENDPOINT=copperx-api-url
    SERVER_URL=your-server-url
    TELEGRAM_BOT_TOKEN=your-telegram-bot-token
    VITE_PUSHER_CLUSTER=your-pusher-cluster
    VITE_PUSHER_KEY=your-pusher-key
    ```

2. Start the bot:

    ```bash
    npm start
    ```

3. Or in development, start bot using:

    ```bash
    npm run dev
    ```

## Usage

1. Add the bot to your Telegram chat.
2. Use the following commands to interact with the bot:

    - `/start` - Start the bot and see available options.
    - `/wallet` - View and manage your wallets.
    - `/transfer` - Perform a transfer.
    - `/kyc` - Verify your identity and see kyc status
    - `/help` - See the list of available commands
    - `/logout` - Log out your account and expire all sessions

## Project Structure

- `src/commands/` - Contains the command handlers for the bot.
- `src/utils/` - Contains utility functions and classes.
- `src/bot.ts` - Initializes and starts the bot.
- `src/app.ts` - Initializes the server and bind the bot webhook.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License.