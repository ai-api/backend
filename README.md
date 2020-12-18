# AI API

## How to run
 1. run `docker-compose up -d`

## Containers
| Service Name | External Port | Internal Port | Description |
|--------------|---------------|---------------|-------------|
| backend | 8080 | 80 | Our backend nodejs server |
| db | 7979 | 5432 | PostgreSQL Database |
| dbgui | 7878 | 8080 | A GUI for accessing/modifying the database |
| ts | 7777 | 8501 | Container hosting Tensorflow Serving that handles the models |



## [Design Docs](https://docs.google.com/document/d/1INPYeMkkMzwxMcpWc0QNHwMBHnJLqR-C87pC0KAKPps/edit?usp=sharing)

