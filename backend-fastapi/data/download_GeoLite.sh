#!/usr/bin/env bash
set -e

# ====================================================
# MaxMind License Key Setup
# Get your key at https://www.maxmind.com/
#
# Option A: Add directly in this script:
#      MAXMIND_LICENSE_KEY="your_key_here"
#
# Option B: Edit ~/.zshrc (or ~/.bashrc if using bash):
#      nano ~/.zshrc
#      export MAXMIND_LICENSE_KEY="your_key_here"
#      source ~/.zshrc
#
# Verify:
#      echo "$MAXMIND_LICENSE_KEY"
# ====================================================

# Uncomment and set if you want to hardcode here:
# MAXMIND_LICENSE_KEY="your_key_here"


curl -fsSL -o GeoLite2-City.tar.gz \
  "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${MAXMIND_LICENSE_KEY}&suffix=tar.gz"

tar -xzf GeoLite2-City.tar.gz
mv GeoLite2-City_*/GeoLite2-City.mmdb ./GeoLite2-City.mmdb
rm -rf GeoLite2-City_* GeoLite2-City.tar.gz

echo "✅ GeoLite2-City.mmdb is ready!"