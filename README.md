# InfoSys Challenge

Base inicial de una aplicacion Flask.

## Estructura

- app.py
- requirements.txt
- templates/index.html
- static/css/style.css
- static/js/app.js
- modules/

## Como arrancar

1. Crear entorno virtual:

	Windows PowerShell:
	python -m venv .venv

2. Activar entorno virtual:

	Windows PowerShell:
	.venv\Scripts\Activate.ps1

3. Instalar dependencias:

	pip install -r requirements.txt

4. Ejecutar Flask:

	python app.py

5. Abrir en navegador:

	http://127.0.0.1:5000

## Endpoints

- / -> pagina principal
- /health -> estado del servicio
