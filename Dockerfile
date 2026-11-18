FROM python:3.12-alpine
WORKDIR /app
COPY index.html .
COPY index-v46.html .
COPY index-v47.html .
COPY index-v48.html .
COPY index-v49.html .
COPY index-v50.html .
COPY index-v51.html .
COPY index-v52.html .
COPY index-v53.html .
COPY index-v54.html .
COPY index-v55.html .
COPY index-v56.html .
COPY index-v57.html .
COPY index-v58.html .
COPY index-v59.html .
COPY index-v60.html .
COPY assets ./assets
COPY menu_mirage_nui_fixed.lua .
CMD ["sh", "-c", "exec python -m http.server ${PORT:-8080} --bind 0.0.0.0"]
