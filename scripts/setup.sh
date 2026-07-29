#!/bin/bash
set -e

echo "=== AI0FY Production Setup ==="

# Check requirements
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting."; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo "OpenSSL is required but not installed. Aborting."; exit 1; }

# Generate secrets
echo "Generating secrets..."
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
CRON_SECRET=$(openssl rand -base64 32 | tr -d '\n')
ENCRYPTION_SECRET=$(openssl rand -base64 32 | tr -d '\n')

# Create .env.production if it doesn't exist
if [ ! -f .env.production ]; then
  echo "Creating .env.production..."
  cp .env.example .env.production

  # Replace placeholders
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env.production
    sed -i '' "s|CRON_SECRET=.*|CRON_SECRET=\"$CRON_SECRET\"|" .env.production
    sed -i '' "s|PROVIDER_KEY_ENCRYPTION_SECRET=.*|PROVIDER_KEY_ENCRYPTION_SECRET=\"$ENCRYPTION_SECRET\"|" .env.production
  else
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|" .env.production
    sed -i "s|CRON_SECRET=.*|CRON_SECRET=\"$CRON_SECRET\"|" .env.production
    sed -i "s|PROVIDER_KEY_ENCRYPTION_SECRET=.*|PROVIDER_KEY_ENCRYPTION_SECRET=\"$ENCRYPTION_SECRET\"|" .env.production
  fi
else
  echo ".env.production already exists, skipping."
fi

echo ""
echo "Secrets generated:"
echo "  JWT_SECRET: $JWT_SECRET"
echo "  CRON_SECRET: $CRON_SECRET"
echo "  ENCRYPTION_SECRET: $ENCRYPTION_SECRET"
echo ""
echo "Next steps:"
echo "  1. Edit .env.production with your Stripe keys and domain"
echo "  2. Run: docker compose up -d postgres redis"
echo "  3. Run: docker compose --profile setup run migrate"
echo "  4. Run: docker compose up -d app"
echo "  5. Check: curl http://localhost:3000/api/health"
echo ""
echo "=== Setup complete ==="
