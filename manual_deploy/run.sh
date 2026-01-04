#!/bin/bash

# 1. Start Proxy Server for API (Port 7860 -> 6001)
# This allows using the main HF HTTPS URL for the Wallet
python3 /app/proxy.py &

# 2. Start Tunnels (Bore.pub - Free & Unlimited)
echo "Starting Bore Tunnels..."
echo "--- LOOK FOR PUBLIC PORTS BELOW ---"

# Tunnel for Node P2P (Port 6000)
noretry() {
    while true; do
        bore local 6000 --to bore.pub | grep --line-buffered -vE "new connection|connection exited|socket not connected"
        sleep 5
    done
}
noretry &

# Tunnel for Mining Stratum (Port 3333)
noretry_mining() {
    while true; do
        bore local 3333 --to bore.pub | grep --line-buffered -vE "new connection|connection exited|socket not connected"
        sleep 5
    done
}
noretry_mining &

# API Tunnel REMOVED: access via https://YOUR-SPACE.hf.space/api/rpc

# 4. Start Volt Node
echo "Starting Volt Core..."
cd /home/appuser/app
# Pipe specific inputs to bypass any interactive prompts if they exist
# But mostly just keep it open.
tail -f /dev/null | /app/volt_core
