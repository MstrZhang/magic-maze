# Magic Maze Server

This folder contains the server-side code for the Magic Maze board game.

## Requirements
- Node dubnium (10.14.2) or carbon (8.14.0)
- npm 6.8.0+
- A MongoDB instance to connect to

## Development
Perform the following steps if you want to work on this project locally

1. Clone the repo and head to the `server` folder
   ```bash
   git clone https://github.com/UTSCC09/project-magicmaze.git
   cd project-magicmaze/server
   ```
2. Install the dependencies
   ```bash
   npm install
   ```
3. Copy `.env.example` into a new `.env` file and fill in the environment variables with your own
   ```bash
   mv .env.example .env
   ```
4. Start the server
   ```bash
   npm start
   ```

Which will start a local server on port `8000`. The graphql endpoints are at `/server/graphql`.


