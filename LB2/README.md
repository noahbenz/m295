# Task List

Autor: Noah Benz

---

## Einrichtung

**Schritt 1**: Klonen Sie das Repository in einen Ordner.

   ``` git clone https://github.com/noahbenz/m295.git ```

**Schritt 2**: Installieren Sie alle Abhängigkeiten.
Gegeben im:  ``` node-modules ``` -> Alle Abhängigkeiten definiert

Kommando : `` npm i `` -> Installiert die Abhängigkeiten

**Schritt 3**: App starten
1. Gehen Sie in den Ordner ``` LB2/src ```
2. Kommando : Mit ``` node tasks.js ``` oder mit nodemon : ``` nodemon tasks.js ```

## API-Endpunkte
**Authentifizierung und Autorisierung**
POST /login: Benutzeranmeldung.
GET /verify: Überprüft die Sitzung.
DELETE /logout: Beendet die Sitzung.

**Aufgabenverwaltung**
GET /tasks: Alle Aufgaben abrufen.
POST /tasks: Neue Aufgabe erstellen.
GET /tasks/{id}: Aufgabe nach ID abrufen.
PUT /tasks/{id}: Aufgabe aktualisieren.
DELETE /tasks/{id}: Aufgabe löschen.

## Files 
- ``` tasks.js ```: Enthält die ganze Logik (Im src Ordner)

- ``` api.json ```: Enthält alle Abfragen die in Postman gemacht wurden.
``` eslint.config.js ```: Enthält die Konfiguration für Eslint.

- ``` README.md ```: Enthält diese Doku.