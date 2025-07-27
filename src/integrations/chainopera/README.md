# ChainOpera Integration (Modular Setup)

This directory contains a modular template for integrating a custom AI agent with ChainOpera's decentralized AI platform.

## Structure
- `Dockerfile` — Containerizes the agent for deployment (clones from GitHub)
- `config.yaml` — Model card for ChainOpera deployment

## Deploy Directly from GitHub

This setup allows anyone to deploy the latest version of this repository as a ChainOpera agent, using only the Dockerfile and config.yaml—no need to clone the repo manually.

## Quickstart

1. **Build the Docker image**
   ```bash
   docker build -t your-dockerhub-username/deepcoin:latest .
   ```

2. **Push to DockerHub**
   ```bash
   docker push your-dockerhub-username/deepcoin:latest
   ```

3. **Install ChainOpera CLI**
   ```bash
   pip install fedml
   ```

4. **Register the model card**
   ```bash
   fedml model create -n my_agent_name -cf config.yaml
   fedml model push -n my_agent_name -k $API_KEY
   ```

5. **Deploy via ChainOpera dashboard**
   - Go to Deploy > My Models and deploy your agent.

6. **Test the endpoint**
   - Use `/health` for readiness, and your app's main API endpoints for inference.

---

- The Dockerfile will always pull the latest code from https://github.com/deepersensor/deepcoin
- Make sure your app exposes a `/health` endpoint and any required inference endpoints.

For more, see [ChainOpera Docs](https://docs.chainopera.ai/deploy/quickstart_docker)
