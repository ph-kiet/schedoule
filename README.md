# Demo video: https://www.youtube.com/watch?v=PqfwHBSBM7Y

# Project Setup and Run Instructions

## Prerequisites

Ensure you have the following installed on your system:

- **Docker**: Required to run the server-side services.
- **Docker Compose**: Required to orchestrate the Redis and MongoDB containers.
- **Node.js**: Required to run the Client and QR.
- **npm**: Required to manage dependencies and run scripts for the client and QR components.

## Setup and Running Instructions

Follow these steps to set up and run the project:

### 1. Set Up the Server Side

The server relies on Redis and MongoDB, which are managed via Docker Compose.

1. Navigate to the project root directory (where `docker-compose.yml` is located).
2. Run the following command to start the Redis and MongoDB containers in detached mode:

   ```bash
   docker compose up -d
   ```

   This will set up and run the server-side dependencies in the background.

### 2. Set Up the Client application

The client is located in the `/client` directory and requires environment configuration.

1. Navigate to the `/client` directory:

   ```bash
   cd client
   ```

2. Rename the `.env.example` file to `.env`:

   ```bash
   mv .env.example .env
   ```

3. Install the dependencies and start the client in development mode:

   ```bash
   npm install --legacy-peer-deps
   npm run build
   npm run start
   ```

   The client application will be accessible at `http://localhost:3000`.

### 3. Set Up the QR application

The QR component is located in the `/qr` directory and follows a similar setup process.

1. Navigate to the `/qr` directory:

   ```bash
   cd qr
   ```

2. Rename the `.env.example` file to `.env`:

   ```bash
   mv .env.example .env
   ```

3. Install the dependencies and start the QR component in development mode:

   ```bash
   npm install
   npm run build
   npm run start
   ```

  The QR application will be accessible at `http://localhost:3000`.

## Notes

- Ensure Docker and Docker Compose are running before starting the server.
- Verify that the `.env` files in both `/client` and `/qr` are correctly configured for your environment.
- If you encounter issues, check the Docker container logs using `docker compose logs` for server-side troubleshooting.


