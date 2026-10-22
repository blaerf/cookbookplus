<!--
  - SPDX-FileCopyrightText: 2026 blaerf
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Abweichungen des Forks von Upstream

Dieses Dokument listet die Änderungen von `blaerf/cookbookplus` gegenüber `nextcloud/cookbook`.

## Kochmodus

Auf der Rezeptseite öffnet der Button „Cooking mode“ eine Vollbildansicht mit einem Zubereitungsschritt pro Seite.
Vor- und zurückblättern geht per Wischen, Pfeiltasten oder Buttons.
Die Zutaten mit den Gesamtmengen für die gewählte Portionenzahl sind immer sichtbar.
Nach dem letzten Schritt lässt sich ein Timer starten (vorbelegt mit der Kochzeit) oder der Kochmodus beenden.
Solange der Kochmodus offen ist, hält ein Wake Lock den Bildschirm an.

- Neu: `src/components/RecipeView/CookingMode.vue`, `src/composables/useWakeLock/index.ts`
- Geändert: `src/components/RecipeView/RecipeView.vue` (Button und Einbindung)
