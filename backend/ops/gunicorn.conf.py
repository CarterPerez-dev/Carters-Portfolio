"""
Gunicorn Configuration
backend/ops/gunicorn.conf.py
"""
import multiprocessing

bind = "0.0.0.0:5000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gevent"
worker_connections = 1000

timeout = 60
keepalive = 30

max_requests = 1000
max_requests_jitter = 100

preload_app = True
reload = False

accesslog = "-"
errorlog = "-"
loglevel = "info"

capture_output = True
enable_stdio_inheritance = True
