"""
Serve the public/ directory on localhost and open the topics page in the browser.
Run: python3 scripts/serve.py
"""
import http.server, os, socketserver, threading, webbrowser
from pathlib import Path

PORT = 8765
public = Path(__file__).resolve().parents[1] / "public"

os.chdir(public)
handler = http.server.SimpleHTTPRequestHandler
handler.log_message = lambda *a: None  # silence request logs

with socketserver.TCPServer(("", PORT), handler) as httpd:
    url = f"http://localhost:{PORT}/topics/"
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    print(f"Serving at {url}  (Ctrl+C to stop)")
    httpd.serve_forever()
