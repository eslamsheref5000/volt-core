#!/bin/bash

# 1. Start Proxy Server for API (Port 7860 -> 6001)
# This allows using the main HF HTTPS URL for the Wallet
echo "--- Starting Python Proxy (Unbuffered) ---"
ls -la /app/proxy.py  # Check if file exists
python3 -u /app/proxy.py &

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

# 3. Start Playit.gg (Handles BOTH Mining & P2P Static Tunnels)
# NOTE: You must claim the agent via the link in the logs, then add tunnels for ports 3333 and 6000 on the website.
echo "--- Starting Playit.gg for Static Addresses ---"
playit &


# API Tunnel REMOVED: access via https://YOUR-SPACE.hf.space/api/rpc

# 4. Start Volt Node
echo "Starting Volt Core..."
cd /home/appuser/app
# Pipe specific inputs to bypass any interactive prompts if they exist
# But mostly just keep it open.
tail -f /dev/null | /app/volt_core
