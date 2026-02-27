#!/bin/bash
# Configures the memo Keycloak realm after startup:
# - Disables "Review Profile" in the First Broker Login flow
#   so university SSO users are created silently with no profile prompt

set -e

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8081}"
REALM="memo"

echo "Waiting for Keycloak to be ready..."
until curl -sf "$KEYCLOAK_URL/realms/memo" > /dev/null 2>&1; do
  sleep 2
done

echo "Getting admin token..."
TOKEN=$(curl -sf -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin&grant_type=password&client_id=admin-cli" \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to get admin token"
  exit 1
fi

echo "Fetching First Broker Login flow executions..."
EXECUTIONS=$(curl -sf "$KEYCLOAK_URL/admin/realms/$REALM/authentication/flows/first%20broker%20login/executions" \
  -H "Authorization: Bearer $TOKEN")

# Extract the Review Profile execution id and current requirement
REVIEW_ID=$(echo "$EXECUTIONS" | grep -o '"id":"[^"]*","requirement":"[^"]*","displayName":"Review Profile[^}]*' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$REVIEW_ID" ]; then
  echo "Could not find Review Profile execution — may already be disabled or flow differs."
  exit 0
fi

echo "Disabling Review Profile (id: $REVIEW_ID)..."
curl -sf -X PUT "$KEYCLOAK_URL/admin/realms/$REALM/authentication/flows/first%20broker%20login/executions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$REVIEW_ID\",\"requirement\":\"DISABLED\"}"

echo ""
echo "Done. Review Profile is now disabled — SSO users will be created silently."
