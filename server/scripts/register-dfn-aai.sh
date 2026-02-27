#!/bin/bash
# Outputs the Keycloak SAML SP metadata required for DFN-AAI registration.
#
# Usage (run from the server/ directory):
#   KEYCLOAK_URL=https://your-production-keycloak.example.com ./scripts/register-dfn-aai.sh
#
# Or for local testing:
#   ./scripts/register-dfn-aai.sh
#
# The generated SP metadata XML must be submitted to DFN-AAI via:
#   https://www.aai.dfn.de/en/participants/sp-registration/
#
# After DFN-AAI approves the registration and distributes the SP metadata to
# member universities, users from those universities will be able to log in.
#
# IMPORTANT: The Keycloak instance must be publicly reachable before registering.
# The ACS (Assertion Consumer Service) URL in the metadata will be based on
# the Keycloak URL — localhost URLs will not work in production.

set -e

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8081}"
REALM="memo"
METADATA_URL="$KEYCLOAK_URL/realms/$REALM/protocol/saml/descriptor"

echo "Fetching SAML SP metadata from:"
echo "  $METADATA_URL"
echo ""

if command -v curl &>/dev/null; then
  curl -sf "$METADATA_URL" | xmllint --format - 2>/dev/null || curl -sf "$METADATA_URL"
elif command -v wget &>/dev/null; then
  wget -qO- "$METADATA_URL"
else
  echo "ERROR: curl or wget is required to fetch metadata."
  exit 1
fi

echo ""
echo "--------------------------------------------------------------------"
echo "DFN-AAI SP Registration Steps:"
echo ""
echo "1. Deploy Keycloak to a publicly accessible server (e.g. https://auth.memo.example.com)"
echo ""
echo "2. Re-run this script with your production URL:"
echo "   KEYCLOAK_URL=https://auth.memo.example.com ./scripts/register-dfn-aai.sh"
echo ""
echo "3. Save the XML output to a file: memo-sp-metadata.xml"
echo ""
echo "4. Register at https://www.aai.dfn.de/en/participants/sp-registration/"
echo "   - Sign the SP participation agreement"
echo "   - Upload memo-sp-metadata.xml via the Metadata Administration Tool"
echo "   - Provide a security contact email"
echo ""
echo "5. After DFN approval (typically a few business days), update Keycloak:"
echo "   a. Open the Keycloak Admin UI for each university IdP"
echo "   b. Under Identity Providers → [university] → import the IdP metadata:"
echo "      - TUM:       https://tumidp.lrz.de/idp/shibboleth"
echo "      - LMU:       https://idp.lrz.de/idp/shibboleth"
echo "      - RWTH:      https://login.rz.rwth-aachen.de/shibboleth"
echo "      - KIT:       https://idp.scc.kit.edu/idp/shibboleth"
echo "      - TU Berlin: https://ephraim.tu-berlin.de/shibboleth"
echo "      - TU Dresden:https://idp.tu-dresden.de/idp/shibboleth"
echo "      - (and so on for other universities)"
echo "   c. Enable 'Validate Signatures' for each IdP once certs are imported"
echo ""
echo "6. Add more DFN-AAI universities by looking up their entityID at:"
echo "   https://tools.aai.dfn.de/entities/"
echo "   Then add them to memo-realm.json and LoginPage.tsx"
echo ""
echo "Full DFN-AAI documentation:"
echo "  https://doku.tid.dfn.de/en:production"
echo "--------------------------------------------------------------------"
