FROM python:3.12-alpine
WORKDIR /app
COPY index.html .
COPY assets ./assets
COPY menu_mirage_nui_fixed.lua .
CMD ["sh", "-c", "exec python -m http.server ${PORT:-8080} --bind 0.0.0.0"]
