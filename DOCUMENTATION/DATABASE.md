# Database Design

Database name:

```text
travel_planner
```

## 1. users

| Column | Type | Description |
|---|---|---|
| id | INT PK AUTO_INCREMENT | User ID |
| name | VARCHAR(100) | User name |
| email | VARCHAR(150) UNIQUE | Email |
| password | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | Registration time |

## 2. destinations

| Column | Type | Description |
|---|---|---|
| id | INT PK AUTO_INCREMENT | Destination ID |
| name | VARCHAR(100) | Destination name |
| description | TEXT | Description |
| image | VARCHAR(255) | Image path |
| best_time | VARCHAR(100) | Best time |

## 3. places

| Column | Type | Description |
|---|---|---|
| id | INT PK AUTO_INCREMENT | Place ID |
| destination_id | INT | Related destination |
| name | VARCHAR(100) | Place name |
| description | TEXT | Description |
| image | VARCHAR(255) | Image path |
| entry_fee | DECIMAL(10,2) | Entry fee |

## 4. hotels

| Column | Type | Description |
|---|---|---|
| id | INT PK AUTO_INCREMENT | Hotel ID |
| destination_id | INT | Related destination |
| name | VARCHAR(150) | Hotel name |
| price | DECIMAL(10,2) | Approximate price |
| rating | DECIMAL(2,1) | Rating |
| image | VARCHAR(255) | Image path |

## 5. trips

| Column | Type | Description |
|---|---|---|
| id | INT PK AUTO_INCREMENT | Trip ID |
| user_id | INT | User |
| destination_id | INT | Destination |
| start_date | DATE | Start |
| end_date | DATE | End |
| travellers | INT | Number of travellers |
| created_at | TIMESTAMP | Created time |

## 6. itinerary

| Column | Type | Description |
|---|---|---|
| id | INT PK AUTO_INCREMENT | Itinerary ID |
| trip_id | INT | Trip |
| day_number | INT | Day number |
| time | VARCHAR(20) | Activity time |
| activity | VARCHAR(255) | Activity |
| notes | TEXT | Notes |

## 7. contact_messages

| Column | Type | Description |
|---|---|---|
| id | INT PK AUTO_INCREMENT | Message ID |
| name | VARCHAR(100) | Sender |
| email | VARCHAR(150) | Email |
| message | TEXT | Message |
| created_at | TIMESTAMP | Time |

## Relationships

```text
users
  |
  | 1-to-many
  v
trips
  |
  | 1-to-many
  v
itinerary

destinations
  |
  +---- places
  |
  +---- hotels
  |
  +---- trips
```

## Design Principle

Keep the database small. External live train and flight results do not need to be permanently stored unless the project later adds booking/history functionality.
