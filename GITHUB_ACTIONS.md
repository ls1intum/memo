# GitHub Actions Deployment Setup

This document describes the GitHub Actions setup for automated building and deployment of the Memo application.

## Overview

The deployment setup consists of:
1. **Build and Push**: Automatically builds Docker images and pushes them to GitHub Container Registry
2. **Deploy**: Deploys the application to different environments (Development, Staging, Production)

## 🚀 What's Been Set Up

### 1. **Build and Push Workflow** ✅
- `.github/workflows/build-and-push.yml` - Automatically builds and pushes Docker images
- Triggers on push to main and pull requests
- Uses the centralized workflow from `ls1intum/.github`

### 2. **Deployment Workflows** ✅
- `deploy-staging.yml` - Deploy to staging environment (for testing)
- `deploy-production.yml` - Deploy to production environment

**Note**: Development environment is for local development only using `./docker-manage.sh up development`

### 3. **Updated Existing Docker Compose Files** ✅
- Modified `docker/production/docker-compose.yml` to use registry images
- Modified `docker/staging/docker-compose.yml` to use registry images
- Added `${IMAGE_TAG}` placeholder for dynamic image selection

## Setup Instructions

### 1. Repository Setup ✅
- [x] Dockerfile created
- [x] docker-compose.prod.yml created
- [x] GitHub Actions workflows created
- [x] Environment files created

### 2. GitHub Repository Settings

You need to configure the following in your GitHub repository:

#### Environments
Go to `Settings > Environments` and create:
- **Staging** (for testing deployments)
- **Production**

**Note**: Development environment is for local development only and doesn't need GitHub environment setup.

#### Secrets and Variables

For each environment, configure:

**Secrets** (Environment Secrets):
- `VM_SSH_PRIVATE_KEY` - SSH private key for deployment user
- Database passwords and other sensitive data

**Variables** (Environment Variables):
- `VM_HOST` - Hostname of the VM (e.g., `dev.memo.aet.cit.tum.de`)
- `VM_USERNAME` - `github_deployment`

### 3. VM Setup

For each environment VM, you need to:

1. **Create deployment user**:
   ```bash
   sudo adduser github_deployment --disabled-password
   sudo usermod -aG docker github_deployment
   sudo mkdir /opt/github && sudo chown github_deployment:github_deployment /opt/github
   ```

2. **Generate SSH key**:
   ```bash
   sudo su github_deployment
   cd /home/github_deployment
   ssh-keygen -t ed25519 -C "github_deployment@<VM_HOST>"
   cat .ssh/id_ed25519.pub > .ssh/authorized_keys
   cat .ssh/id_ed25519  # Copy this to VM_SSH_PRIVATE_KEY secret
   ```

3. **Install Docker** (if not already installed):
   Follow [Docker installation instructions](https://docs.docker.com/engine/install/ubuntu/)

### 4. Environment Configuration

Update the environment files with your actual values:
- `docker/development/.env` - Local development configuration (used with `./docker-manage.sh`)
- `docker/staging/.env` - Staging deployment configuration
- `docker/production/.env` - Production deployment configuration

**Important**: Update the following in each file:
- Database passwords (make them unique and secure)
- API URLs (replace with your actual domains)
- Any other environment-specific variables

### 5. Deployment Process

#### Automatic Deployment
- Images are automatically built on push to main and PR creation
- Manual deployment via GitHub Actions UI

#### Manual Deployment
1. Go to `Actions` tab in GitHub
2. Select the deployment workflow (e.g., "Deploy to Staging")
3. Click "Run workflow"
4. Enter image tag (optional - defaults to `latest` for main branch, `pr-<number>` for PRs)
5. Approve deployment (if environment protection rules are configured)

## File Structure

```
.github/
├── workflows/
│   ├── build-and-push.yml
│   ├── deploy-development.yml
│   ├── deploy-staging.yml
│   └── deploy-production.yml
├── .env.development
├── .env.staging
├── .env.production
├── docker-compose.prod.yml
└── GITHUB_ACTIONS.md
```

## Security Considerations

1. **Environment Protection**: Configure required reviewers for production deployments
2. **Secrets Management**: Use GitHub secrets for sensitive data, never commit passwords
3. **SSH Keys**: Use dedicated deployment keys, rotate regularly
4. **Database Passwords**: Use strong, unique passwords for each environment
5. **VM Access**: Limit SSH access to deployment user only

## Monitoring and Troubleshooting

### Workflow Logs
- Check GitHub Actions logs for build and deployment issues
- Logs are available in the Actions tab of your repository

### VM Logs
- SSH into VM: `ssh github_deployment@<VM_HOST>`
- Check Docker logs: `docker-compose -f /opt/github/docker-compose.prod.yml logs`
- Check container status: `docker ps`

### Common Issues
1. **SSH Connection Failed**: Check VM_SSH_PRIVATE_KEY secret and VM accessibility
2. **Image Not Found**: Ensure build workflow completed successfully
3. **Database Connection**: Verify database credentials and network configuration
4. **Nginx Issues**: Check nginx configuration and port availability

## Next Steps

1. **SSL Certificates**: Configure SSL for production environment
2. **Monitoring**: Set up application and infrastructure monitoring
3. **Backups**: Implement database backup strategy
4. **Scaling**: Consider load balancing for high availability
