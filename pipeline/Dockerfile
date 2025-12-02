# Start from a Node container
FROM timbru31/java-node:21-20
# Setup working folder
WORKDIR /opt/pipeline
COPY . .
# Install dependencies
RUN npm install

# Environment variable placeholder (optional)
ENV DATASTREAM=""
ENV DEBUG=*

# On container start: inject the dataset ID into metadata.ttl, then run the pipeline
# ENTRYPOINT sh -c 'sed "s/\\[\\[id\\]\\]/${DATASET}/g" metadata.ttl > metadata.tmp && mv metadata.tmp metadata.ttl && sed "s/\\[\\[id\\]\\]/${DATASET}/g" pipeline.ttl > pipeline.tmp && mv pipeline.tmp pipeline.ttl && exec npx rdfc pipeline.ttl'
# ENTRYPOINT ["/bin/sh", "-c", "sed \"s/\\[\\[id\\]\\]/${DATASTREAM}/g\" metadata.ttl > metadata.tmp && mv metadata.tmp metadata.ttl && sed \"s/\\[\\[id\\]\\]/${DATASTREAM}/g\" pipeline.ttl > pipeline.tmp && mv pipeline.tmp pipeline.ttl && cat pipeline.ttl && exec npx rdfc pipeline.ttl"]


# ENTRYPOINT sh -c 'sed -i "s/\\[\\[id\\]\\]/${DATASET}/g" metadata.ttl && 'sed -i "s/\\[\\[id\\]\\]/${DATASET}/g" pipeline.ttl && exec npx rdfc pipeline.ttl'

# # Container's entrypoint command
ENTRYPOINT [ "npx", "rdfc", "pipeline.ttl" ]

