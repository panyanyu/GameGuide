# GameGuide

## Description

GameGuide is a game navigation site built with Next.js, aggregating popular gaming platforms, media, communities, tools, and resource recommendations. The project uses React + TypeScript and includes a Google AdSense loader component.

## Features

- Recommended game websites and resources
- Keyword search filtering
- Fetch public game API data from the network
- Dynamic Google AdSense injection
- Built with Next.js 16, React 19, and TypeScript 6

## Software Architecture

- `Next.js`: App Router-based rendering and routing
- `React`: UI and interaction logic
- `TypeScript`: type-safe development
- `app/`: pages, layouts and client components
- `config/adsense.ts`: Google AdSense configuration

## Installation

1. Clone the repository
2. Change to the project folder: `cd GameGuide`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

## Usage

1. Open the browser at `http://localhost:3000`
2. Enter keywords in the search box to filter site recommendations
3. Click the "Network Search Recommendation" button to load additional game API data
4. To enable AdSense, update `config/adsense.ts` with your own `clientId` and `homepageSlot`

## Project Structure

- `app/`: Next.js pages, layout, and components
- `config/`: AdSense configuration
- `public/`: static assets
- `package.json`: dependencies and scripts

## Contribution

1. Fork the repository
2. Create a branch: `feat/xxx`
3. Commit your changes and push
4. Open a Pull Request

## Notes

This project uses `https://api.publicapis.org/entries?category=Games` as the source for network-recommended game data.
