---
title: Catalogue
description: Records, search, Z39.50, and MARC import, for library staff.
navTitle: Catalogue
order: 31
section: features
draft: false
locale: en
---

A **record** describes a work or an edition. A **copy** is the physical object attached to that record. Staff catalogue from the Cataloguing menu. A signed-in patron uses the catalogue in their own area. The catalogue on the home page needs no account. See [OPAC](/en/docs/opac/).

![Catalogue list, light theme.](screen:catalogue "The catalogue list shows whether each title is available.")

![A title record, light theme.](screen:record "The record lists the copies and their state.")

MARC import of deposited documents is described in [Deposits](/en/docs/deposits/).

## Create and edit

Creating a record, opening it, or editing it requires the right to edit the catalogue. Librarian and administrator accounts have it in the shipped set.

Usual fields: titles, authors, ISBN, collection ISSN, document type, audience, Dewey number, series, collection. An ISBN that is already known asks for confirmation before the existing record is overwritten.

The document types on offer cover the book, the comic, the periodical, video and DVD, video tape, music and other sound recordings, the CD-ROM, images, multimedia, and an unknown type. Old short codes remain readable.

Series and collections have their own record: a name, secondary titles, and an ISSN for a collection.

Deleting a record requires the same write right. Deletion is refused while a copy or a hold remains. Forcing does not lift that refusal.

A spreadsheet export of the catalogue is offered to staff allowed to read the catalogue.

## Search

Staff search in the catalogue list. The search engine answers when it can be reached. Otherwise search uses the database. A full reindex is reserved for an administrator: Settings, Server, Catalog tab.

## Z39.50

The search screen queries the servers saved in Settings. A hit can be imported as a record. Responses are cached for seven days by default.

Each server has an address, a port, a database, and an on/off switch. The form is on the “Z39.50 servers” tab, visible when the module is on.

## MARC import

The import screen sends an ISO 2709 or MARCXML file. Loading the file in order to read it back requires catalogue read rights. Saving the batch into the catalogue requires write rights. Batches already loaded can be opened again.

The document type is taken from the MARC record. Deposit mode, which attaches copies to a batch received from a lender, is described in [Deposits](/en/docs/deposits/).

## Record screen

The screen lists the copies, their availability, and the hold queue for the record. Adding a copy is described in [Copies](/en/docs/copies/).
