
import http.server
import socketserver
import urllib.request
import urllib.error
import sys

PORT = 7860
NODE_API_URL = "http://127.0.0.1:6001"

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Node-Url")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/" or self.path == "/health":
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"<h1>Volt Node is RUNNING ⚡</h1><p>API Proxy Active on Port 7860</p>")
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        # We forward all POSTs to the Node API
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        req = urllib.request.Request(NODE_API_URL, data=post_data, method="POST")
        # Copy headers if needed, but usually just Content-Type is enough
        req.add_header("Content-Type", "application/json")

        try:
            with urllib.request.urlopen(req) as response:
                self.send_response(response.status)
                self._send_cors_headers()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(response.read())
        except urllib.error.URLError as e:
            self.send_response(502)
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(f'{{"status":"error", "message":"Node Unreachable: {e}"}}'.encode())

print(f"Starting Volt Proxy on port {PORT} -> {NODE_API_URL}")
with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
    httpd.serve_forever()
