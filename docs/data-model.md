# Khelega — Data Model (v1)

This document describes the core data entities for Khelega's MVP (Minimum Viable Product).
It is a design reference — not code — meant to guide backend development.

---

## 1. User

Represents a person using the platform.

| Field       | Type            | Required | Notes                                      |
|-------------|-----------------|----------|---------------------------------------------|
| name        | String          | Yes      | Display name shown on posts                |
| email       | String          | Yes      | Must be unique; used for login              |
| password    | String (hashed) | Yes      | Never store plain text passwords            |
| createdAt   | Date            | Auto     | Timestamp of account creation               |

**Future fields (not in MVP):** phone number, profile picture, bio, average rating.

---

## 2. Post

Represents a request to play a sport, created by a User.

| Field          | Type                  | Required | Notes                                                        |
|----------------|-----------------------|----------|---------------------------------------------------------------|
| sport          | String (enum)         | Yes      | Fixed list: Football, Cricket, Badminton, etc.                |
| location       | String                | Yes      | Plain text for MVP (e.g. "Sector 62, Noida")                  |
| dateTime       | Date                  | Yes      | Combined date + time of the game                              |
| playersNeeded  | Number                | Yes      | Total players the creator is looking for                      |
| playersJoined  | Array of User refs    | Auto     | Starts empty; grows as users join                              |
| hasEquipment   | Boolean               | Yes      | true = creator has equipment, false = players must bring own  |
| createdBy      | User reference        | Yes      | Links post to the User who created it                         |
| status         | String (enum)         | Auto     | open / full / completed / cancelled                            |
| createdAt      | Date                  | Auto     | Timestamp of post creation                                     |

**Future fields (not in MVP):** GPS coordinates, chat thread reference, cancellation reason.

---

## Design Notes

- **Why `location` is plain text for now:** Real map-based location (coordinates, "nearby"
  search) is a v2 feature. Plain text keeps the MVP simple and still fully usable.
- **Why `playersJoined` is separate from `playersNeeded`:** The app needs to calculate
  "spots remaining" = playersNeeded − playersJoined.length. Both fields are required for
  this logic to work.
- **Why `createdBy` matters:** Needed for permissions (only the creator can edit/delete
  a post), for "My Posts" views, and later for ratings/accountability.
- **Why `hasEquipment` is a boolean, not text:** Keeps it simple and filterable
  (e.g., "show only posts with equipment provided") without messy free-text matching.

---

## Status: Draft v1 — subject to change as features are added (chat, ratings, notifications).
