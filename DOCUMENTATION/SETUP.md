# Setup Guide

## 1. Install Required Software

Install:

- Node.js
- VS Code
- XAMPP
- Git (optional)

Start Apache and MySQL from XAMPP.

## 2. Create React Application

Example:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom
npm run dev
```

Axios is optional:

```bash
npm install axios
```

You can also use the browser Fetch API instead.

## 3. PHP Backend

Place the backend inside the XAMPP htdocs folder:

```text
C:/xampp/htdocs/travel-journey-planner/backend
```

Test:

```text
http://localhost/travel-journey-planner/backend/
```

## 4. MySQL

Open:

```text
http://localhost/phpmyadmin
```

Create:

```text
travel_planner
```

Import:

```text
database/travel_planner.sql
```

## 5. Database Connection

Example PHP connection:

```php
$host = "localhost";
$db = "travel_planner";
$user = "root";
$password = "";

$conn = new PDO(
    "mysql:host=$host;dbname=$db;charset=utf8mb4",
    $user,
    $password
);
```

## 6. API Credentials

Add credentials on the PHP/server side.

Required integrations:

- RailRadar API
- Amadeus API
- Gemini API
- Weather API

Do not place private keys inside React files.

## 7. Run

Start XAMPP:

```text
Apache: ON
MySQL: ON
```

Start React:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal.

## 8. Development Order

Recommended order:

1. Create database
2. Create PHP database connection
3. Create destination API
4. Create React pages
5. Connect destinations
6. Add places and hotels
7. Add login/register
8. Add trip and itinerary
9. Add budget
10. Add weather
11. Add RailRadar
12. Add Amadeus
13. Add Gemini
14. Improve CSS
15. Test everything
