FROM docker.io/node:gallium-slim

LABEL MAINTAINER=mbuchleitner@infralovers.com

COPY colors.js /
COPY index.html /

ENTRYPOINT [ "/usr/local/bin/node", "/colors.js" ]
