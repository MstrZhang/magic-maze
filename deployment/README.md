# Magic Maze Deployments

This folder holds the deployment scripts for development and production purposes.

## Deploy using docker-compose
The `docker-compose.yml` is mainly used for development purposes. It allows you to quickly spin up both the `web` and `api` applications and have them communicating with each other.

### Requirements
You'll need the following dependencies to run everything
- the client and server source code
- Docker version 18.09.2 or higher

### Running
Perform the following steps to get the app up and running:

1. Clone this repo and head to `deployment/`
   ```bash
   git clone https://github.com/UTSCC09/project-magicmaze.git
   cd deployments
   ```
2. Copy the `server_variables.env.example` into `server_variables.env` and change the environment variables to your own
   ```bash
   mv server_variables.env.example server_variables.env
   ```
3. Run the `docker-compose.yml`
   ```bash
   docker-compose up
   ```

This will start the client on port 3000 and the server on port 8000 (or whatever port you set).

Since the source folders are mounted to the docker containers your local changes will refresh the server and clients on save, making the development process quicker.

## Deploy using Kubernetes and GCP
<!-- TODO -->
