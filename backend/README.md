## Config
Copiar `example.json` a `default.json` y modificar según los valores necesarios.

## Turnos
Periódicamente el `backend` realiza una consulta al motor de base de datos y
guarda el resultado de dicha consulta en un archivo local (turnos.json).
Posteriormente el `backend` sirve dicho archivo JSON para ser consumido
directamente desde el `frontend`

## Medias
Los medios se descargan de una cuenta de Google Drive y se guardan en local.
Posteriormente el `backend` lo muestra directamente desde la copia local
