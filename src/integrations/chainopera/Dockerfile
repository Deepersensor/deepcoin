# Dockerfile for ChainOpera agent (deploys from GitHub)
FROM node:20-slim

WORKDIR /app

# Install git, clone the repo, then remove git
RUN apt-get update && apt-get install -y git && \
    git clone --depth 1 https://github.com/deepersensor/deepcoin.git . && \
    apt-get remove -y git && apt-get autoremove -y

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build the app (if needed)
RUN pnpm build

# Expose the port (adjust if your app uses a different port)
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
