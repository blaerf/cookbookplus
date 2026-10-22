<!--
  - SPDX-FileCopyrightText: 2026 blaerf
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Fork-Kontext für Claude Code

Dieses Repository ist der private Fork `blaerf/cookbookplus` von `nextcloud/cookbook`.
Hier wird nur für den Eigenbedarf entwickelt. Beiträge an Nextcloud sind nicht geplant.

Wo diese Datei und `AGENTS.md` sich widersprechen, gilt diese Datei.
Alles andere aus `AGENTS.md` gilt weiter, insbesondere: temporäre Dateien und Logs nur unter `.tmp/`, `npm run type-check` einzeln ausführen.

## Kein Kontakt zu Upstream

- Keine Issues, Pull Requests, Kommentare oder Reviews auf `nextcloud/cookbook`.
- Keine Empfehlung, vorab ein Ticket bei Nextcloud zu eröffnen. Offene Fragen direkt mit mir klären.
- Pull Requests höchstens innerhalb von `blaerf/cookbookplus`, und nur auf ausdrückliche Anweisung. Basis ist dann immer dieser Fork, nie `nextcloud/cookbook`.
- Der Remote `upstream` ist nur zum Lesen da; sein Push-Ziel ist absichtlich ungültig.

## Commits

- Nur committen, wenn ich es ausdrücklich sage.
- Ohne `-s` und ohne `-S`: kein `Signed-off-by`, keine GPG-Signatur.
- Conventional Commits (`feat: …`, `fix: …`), ohne Scope `cookbook`.
- Trailer `Assisted-by: Claude Code` am Ende der Commit-Nachricht.

## Branches

- `master` ist ein exakter Spiegel von `upstream/master`. Nie darauf committen.
- `main` ist der Arbeitszweig des Forks.
- Neue Arbeit in `feature/<name>` oder `fix/<name>`, abgezweigt von `main`.

## Diff zu Upstream klein halten

- Neue Funktionen bevorzugt in neuen Dateien statt in großen Umbauten bestehender Dateien.
- Keine Formatierungs- oder Refactoring-Änderungen an Upstream-Code, die die Aufgabe nicht braucht.
- `CHANGELOG.md` nie ändern (wird upstream von release-please erzeugt).
- Abweichungen des Forks in `FORK.md` festhalten (anlegen, sobald es die erste gibt).
- App-ID bleibt `cookbook`; Namespace, Tabellennamen und Routen-Präfix nicht umbenennen.
- `/api/v1` nicht inkompatibel ändern (Mobile-Clients). Eigene Endpunkte unter eigenem Pfad.
- Neue Rezeptfelder schema.org-konform halten.
- Kein `npm audit fix --force` und keine Abhängigkeits-Upgrades ohne Anweisung.
- Neue Dateien bekommen SPDX-Header wie die bestehenden.

## Prüfen vor dem Abschluss

```sh
npm run eslint
npm run prettier
npm run stylelint
npm run type-check
npx jest
npm run build
composer cs:check
composer psalm
```

`npm test` funktioniert unter Windows nicht (Linux-Shell-Syntax), daher `npx jest`.
Psalm braucht PHP 8.3.16 oder neuer.

## Meine Umgebung

- Windows, WebStorm, PowerShell; Node 24, npm 11.
- Lokale Nextcloud 35 in Docker unter `http://localhost:8080`, Compose-Datei in `C:\Users\blaerf\nextcloud-dev\`; der Projektordner ist dort schreibgeschützt als `custom_apps/cookbook` eingebunden.
- Frontend-Änderungen sichtbar über `npm run dev` und Neuladen mit Strg+Shift+R.
- Antworten auf Deutsch. Dateien zum Bearbeiten mit Notepad++ öffnen, nicht mit Notepad.
