# Ticker TS React Electron

Ticker TS React Electron is a desktop application built with React, TypeScript, and Electron. It provides real-time cryptocurrency and stock price tracking with interactive charts and a customizable user interface.

## Features

- **Cryptocurrency and Stock Tracking**: Monitor prices for selected cryptocurrencies and stocks.
- **Interactive Charts**: View data in line, bar, or area charts with adjustable time ranges.
- **Dark Mode Support**: Toggle between light and dark themes.
- **Persistent Settings**: Save selected tickers, stocks, and preferences locally.
- **Electron Integration**: Desktop application with window state persistence.

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI
- **Charts**: Recharts
- **Backend**: Electron
- **API**: CoinGecko API for cryptocurrency data

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ticker-ts-react-electron.git
   cd ticker-ts-react-electron
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run start
   ```

   This will start both the React development server and the Electron app.

## Scripts

- `npm run react-start`: Start the React development server.
- `npm run electron-start`: Start the Electron app.
- `npm run start`: Start both React and Electron concurrently.
- `npm run build`: Build the React app for production.
- `npm run build:electron`: Compile the Electron app.
- `npm run dist`: Build the entire app for distribution.
- `npm run serve`: Serve the Electron app.

## Usage

1. Launch the app using `npm run start`.
2. Use the navigation bar to select cryptocurrencies or stocks to track.
3. Adjust the chart type and time range using the controls in each chart container.
4. Toggle between light and dark modes using the theme switcher.

## File Structure

- **`src/components`**: Contains React components for the app.
- **`src/electron.js`**: Main Electron process file.
- **`package.json`**: Project configuration and dependencies.

## Development Notes

- **Electron Window State**: The app saves and restores the window size and position using `windowBounds.json`.
- **Render Queue**: Charts are rendered sequentially with a delay to optimize performance.
- **API Rate Limiting**: A shared request queue ensures compliance with API rate limits.

## Dependencies

### Main Dependencies
- React
- Electron
- Material-UI
- Recharts
- Tabler Icons

### Dev Dependencies
- TypeScript
- Electron Builder
- Concurrently
