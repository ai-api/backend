# AI API

## How to run
 1. Rename `.env-sample` to `.env` and fill in the `DB_PASSWORD` variable
 2. run `docker-compose up -d`

## Containers
| Service Name | External Port | Internal Port | Description |
|--------------|---------------|---------------|-------------|
| ts | - | 8501 | Container hosting Tensorflow Serving that handles the models |
| db | 7878 | 5432 | PostgreSQL Database |
| dbgui | 7979 | 8080 | A GUI for accessing/modifying the database |
| nginx | 8080 | 80 | Nginx container that reroutes requests |


## [Design Docs](https://docs.google.com/document/d/1INPYeMkkMzwxMcpWc0QNHwMBHnJLqR-C87pC0KAKPps/edit?usp=sharing)

