# Deployment Setup Verification Checklist

## ✅ **GitHub Actions Workflows**

- [x] `build-and-push.yml` - Builds and pushes Docker images
- [x] `deploy-staging.yml` - Deploys to staging environment
- [x] `deploy-production.yml` - Deploys to production environment
- [x] No development deployment workflow (correct!)

## ✅ **Docker Compose Files**

- [x] `docker/development/docker-compose.yml` - Local development (uses build:)
- [x] `docker/staging/docker-compose.yml` - Uses registry image with ${IMAGE_TAG}
- [x] `docker/production/docker-compose.yml` - Uses registry image with ${IMAGE_TAG}

## ✅ **Environment Files**

- [x] `docker/development/.env` - Local development config (localhost URLs)
- [x] `docker/staging/.env` - Staging config (staging.memo.aet.cit.tum.de)
- [x] `docker/production/.env` - Production config (memo.aet.cit.tum.de)
- [x] All env files have IMAGE_TAG=latest
- [x] All URLs updated to memo.aet.cit.tum.de domain

## ✅ **Dockerfile**

- [x] Multi-stage Dockerfile with development, builder, and production targets
- [x] Properly configured for Next.js application

## ✅ **Configuration Files**

- [x] `.dockerignore` - Excludes unnecessary files from build context
- [x] `docker/staging/nginx.conf` - Nginx config for staging
- [x] `docker/production/nginx.conf` - Nginx config for production with security

## 🔧 **Next Steps Required (Manual Setup)**

### GitHub Repository Settings:

1. **Create Environments**:
   - Go to `Settings > Environments`
   - Create: `Staging`, `Production`

2. **For each environment, configure**: **Secrets:**
   - `VM_SSH_PRIVATE_KEY` - SSH private key for deployment user

   **Variables:**
   - `VM_HOST` - Server hostname (e.g., `staging.memo.aet.cit.tum.de`, `memo.aet.cit.tum.de`)
   - `VM_USERNAME` - `github_deployment`

### VM Setup (for each environment):

1. Create deployment user: `github_deployment`
2. Add to docker group
3. Generate SSH keys
4. Set up deployment directory: `/opt/github`

## 🚀 **Deployment Process**

1. **Code Push** → Automatic image build (`ghcr.io/ls1intum/memo/memo-app:latest` or `pr-<number>`)
2. **Staging Deploy** → Manual trigger via GitHub Actions UI
3. **Production Deploy** → Manual trigger via GitHub Actions UI

## 🎯 **Environment Usage**

- **Development**: `./docker-manage.sh up development` (local only)
- **Staging**: GitHub Actions deployment (testing)
- **Production**: GitHub Actions deployment (live)

## ✅ **All Issues Fixed**

- [x] Removed redundant development deployment workflow
- [x] Fixed all domain URLs to memo.aet.cit.tum.de
- [x] Added IMAGE_TAG to environment files
- [x] Proper separation of local vs CI environments
- [x] Clean file structure without duplicates
