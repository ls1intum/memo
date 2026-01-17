# Test Server Setup Guide - LRZ VM (memo-test1.aet.cit.tum.de)

This guide will help you set up the test environment on your LRZ virtual machine.

## Prerequisites

- Access to LRZ VM at `memo-test1.aet.cit.tum.de`
- Root or sudo access on the VM
- Domain `memo-test1.aet.cit.tum.de` pointing to your VM's IP address

## Step 1: Initial VM Setup

### 1.1 Connect to Your VM

```bash
ssh your-username@memo-test1.aet.cit.tum.de
```

### 1.2 Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Install Required Software

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose (v2)
sudo apt install docker-compose-plugin -y

# Install Certbot for SSL certificates
sudo apt install certbot -y

# Install Git (if needed)
sudo apt install git -y
```

## Step 2: Create Deployment User

### 2.1 Create the User

```bash
sudo useradd -m -s /bin/bash github_deployment
sudo usermod -aG docker github_deployment
```

### 2.2 Set Up SSH for Deployment User

```bash
# Switch to deployment user
sudo su - github_deployment

# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-deployment-test" -f ~/.ssh/id_ed25519 -N ""

# Create authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Display the public key (you'll add this to GitHub later)
cat ~/.ssh/id_ed25519.pub
```

**Important**: Copy the **private key** content - you'll need to add this as a GitHub secret:

```bash
cat ~/.ssh/id_ed25519
```

Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and
`-----END OPENSSH PRIVATE KEY-----`)

### 2.3 Add Your Own SSH Key for Deployment User

While still as `github_deployment` user:

```bash
# Add your personal public key to allow manual access
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
```

Exit back to your main user:

```bash
exit
```

## Step 3: Create Deployment Directory

```bash
sudo mkdir -p /opt/github
sudo chown github_deployment:github_deployment /opt/github
sudo chmod 755 /opt/github
```

## Step 4: Set Up SSL Certificate (Let's Encrypt)

### 4.1 Obtain SSL Certificate

```bash
sudo certbot certonly --standalone -d memo-test1.aet.cit.tum.de
```

Follow the prompts:

- Enter your email address
- Agree to terms of service
- Choose whether to share email with EFF

### 4.2 Set Up Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Set up automatic renewal (should be configured by default)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 4.3 Give Docker Access to Certificates

```bash
# Create a post-renewal hook to ensure permissions
sudo mkdir -p /etc/letsencrypt/renewal-hooks/post
sudo tee /etc/letsencrypt/renewal-hooks/post/docker-reload.sh > /dev/null <<'EOF'
#!/bin/bash
docker restart memo-test-nginx 2>/dev/null || true
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/post/docker-reload.sh
```

## Step 5: Configure Firewall (if enabled)

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall (if not already enabled)
sudo ufw --force enable
```

## Step 6: GitHub Repository Configuration

### 6.1 Create GitHub Environment

1. Go to your repository: `https://github.com/ls1intum/memo`
2. Navigate to **Settings > Environments**
3. Click **New environment**
4. Name it: `Test`
5. Click **Configure environment**

### 6.2 Add Environment Secrets

Add the following secret:

- **Secret name**: `VM_SSH_PRIVATE_KEY`
- **Value**: Paste the private key you copied earlier (from Step 2.2)

### 6.3 Add Environment Variables

Add the following variables:

- **Variable name**: `VM_HOST`
- **Value**: `memo-test1.aet.cit.tum.de`

- **Variable name**: `VM_USERNAME`
- **Value**: `github_deployment`

## Step 7: Create Environment File on VM

```bash
# Switch to deployment user
sudo su - github_deployment

# Create docker directory structure
mkdir -p /opt/github/docker/test

# Create .env file
cat > /opt/github/docker/test/.env << 'EOF'
# Docker Image Tag
IMAGE_TAG=latest

# Database Configuration
DATABASE_URL=postgresql://memo_user:memo_password@db:5432/memo_test

# Application Environment
NEXT_PUBLIC_APP_ENV=test
NEXT_PUBLIC_API_URL=https://memo-test1.aet.cit.tum.de/api
EOF

# Set proper permissions
chmod 600 /opt/github/docker/test/.env

# Exit back to your user
exit
```

## Step 8: Test Deployment

### 8.1 Trigger Deployment from GitHub

1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy to Test** workflow
3. Click **Run workflow**
4. Select the branch (usually `main`)
5. Optionally specify an image tag (or leave empty for `latest`)
6. Click **Run workflow**

### 8.2 Monitor Deployment

The deployment will:

1. SSH into your VM
2. Pull the Docker image from GitHub Container Registry
3. Copy docker-compose.yml and nginx.conf
4. Start the containers

### 8.3 Verify Deployment

```bash
# SSH into your VM
ssh github_deployment@memo-test1.aet.cit.tum.de

# Check running containers
docker ps

# Check logs
docker logs memo-test-app
docker logs memo-test-nginx
docker logs memo-test-db

# Test the application
curl http://localhost/health
curl https://memo-test1.aet.cit.tum.de/health
```

## Step 9: DNS Verification

Make sure your domain points to the VM:

```bash
# On your local machine
dig memo-test1.aet.cit.tum.de
nslookup memo-test1.aet.cit.tum.de
```

The IP address should match your LRZ VM's IP.

## Troubleshooting

### Issue: SSL Certificate Not Found

If nginx fails to start due to missing certificates:

1. Initially start without SSL by temporarily modifying nginx.conf to only listen on port 80
2. Obtain SSL certificate using certbot
3. Restart with full SSL configuration

### Issue: Permission Denied for Docker

```bash
# Make sure github_deployment is in docker group
sudo usermod -aG docker github_deployment

# Logout and login again or restart docker
sudo systemctl restart docker
```

### Issue: Container Can't Access SSL Certificates

```bash
# Check certificate permissions
sudo ls -la /etc/letsencrypt/live/memo-test1.aet.cit.tum.de/

# If needed, adjust permissions (careful with security)
sudo chmod -R 755 /etc/letsencrypt/live
sudo chmod -R 755 /etc/letsencrypt/archive
```

### Issue: Database Connection Failed

```bash
# Check database logs
docker logs memo-test-db

# Verify database is healthy
docker exec -it memo-test-db psql -U memo_user -d memo_test -c "SELECT 1;"
```

### Viewing Logs

```bash
# All services
docker-compose -f /opt/github/docker/test/docker-compose.yml logs -f

# Specific service
docker logs -f memo-test-app
docker logs -f memo-test-nginx
docker logs -f memo-test-db
```

## Manual Deployment (Alternative)

If you need to deploy manually without GitHub Actions:

```bash
# SSH into VM as github_deployment
ssh github_deployment@memo-test1.aet.cit.tum.de

# Navigate to deployment directory
cd /opt/github

# Clone or pull repository (if doing manual deployment)
git clone https://github.com/ls1intum/memo.git
cd memo

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull latest image
docker pull ghcr.io/ls1intum/memo/memo-app:latest

# Deploy using docker-compose
cd docker/test
docker compose down
docker compose up -d

# Check status
docker compose ps
docker compose logs -f
```

## Maintenance

### Update Application

Trigger the **Deploy to Test** workflow from GitHub Actions with the desired image tag.

### View Logs

```bash
ssh github_deployment@memo-test1.aet.cit.tum.de
docker logs -f memo-test-app
```

### Restart Services

```bash
ssh github_deployment@memo-test1.aet.cit.tum.de
cd /opt/github/docker/test
docker compose restart
```

### Database Backup

```bash
# Create backup
docker exec memo-test-db pg_dump -U memo_user memo_test > backup-$(date +%Y%m%d).sql

# Restore backup (replace YYYYMMDD with the actual date of the backup file)
docker exec -i memo-test-db psql -U memo_user -d memo_test < backup-YYYYMMDD.sql
```

### SSL Certificate Renewal

Certificates are auto-renewed by certbot. To manually renew:

```bash
sudo certbot renew
sudo docker restart memo-test-nginx
```

## Security Recommendations

1. **Change default database password** in `/opt/github/docker/test/.env`
2. **Restrict SSH access** to specific IP addresses if possible
3. **Keep system updated** regularly with `apt update && apt upgrade`
4. **Monitor logs** regularly for suspicious activity
5. **Set up monitoring** (optional) using tools like Prometheus/Grafana
6. **Regular backups** of database and important data

## Next Steps

Once your test server is running successfully:

1. Test your application thoroughly
2. Update DNS if needed
3. Set up monitoring (optional)
4. Document any test-specific configurations
5. Consider setting up staging environment using similar process

## Support

For issues specific to:

- **LRZ Infrastructure**: Contact LRZ support
- **Application Issues**: Check application logs and GitHub Issues
- **Deployment Issues**: Check GitHub Actions logs
