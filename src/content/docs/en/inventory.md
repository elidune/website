---
title: Inventory
description: An inventory session, barcode scanning, closing, and consolidation.
navTitle: Inventory
order: 34
section: features
draft: false
locale: en
---

Inventory is reserved for staff who can edit copies, and for the inventory module.

![Inventory session, light theme.](screen:inventory "An open session, with the barcode scan field.")

A session is **open** or **closed**. The “Consolidated” badge appears after consolidation. There is no other state.

The scope is set at creation: an optional site, and an optional place code. It cannot be changed afterwards. With both empty, the count covers active copies that are not archived. The “place hint” text stays a display label. The software does not filter copies with that text.

1. Create a session with a label. The site and the place code are optional.
2. While the session is open, record each copy by barcode, or import a list. More than 500 codes in a single send are refused. The interface splits longer lists. Importing a long list runs as a background task.
3. Each scan gets a result: found in scope, found out of scope, found but already archived, or unknown barcode. The same code can be read several times. The report counts those extra reads as duplicates. The missing list is the active copies in scope that are absent from the session log.
4. Closing moves the session to “closed”. A closed session refuses any new scan. The gap report lists what was expected in scope, out of scope, archived, unknown codes, and duplicates.
5. After closing, consolidation archives the missing copies in scope. A record with no active copy left is archived. Without forcing, copies on an active loan are left aside and the session is not marked consolidated, so it can be run again with force. With force, those loans are closed. The patrons concerned receive a message, in French or English according to the language chain described in [Languages](/en/docs/languages/).

Consolidation is irreversible for the archived copies and, when it is forced, for the loans it closes. Read the report and the preview before confirming.

Consolidation can also run as a background task. Staff follow progress from the screen.
