# Testing Document

## 1. Home Page

Test:
- Page loads
- Navigation works
- Destination links work

## 2. Destination

Test:
- Destinations are displayed
- Details open correctly
- Invalid ID shows an error

## 3. Train Search

Test:
- Source can be entered
- Destination can be entered
- Date can be selected
- Results are displayed when RailRadar responds
- API failure shows an error message

## 4. Flight Search

Test:
- Origin is entered
- Destination is entered
- Date is entered
- Passenger count works
- Results display when Amadeus responds

## 5. AI Recommendation

Test:
- Destination is required
- Number of days is valid
- Budget is valid
- Gemini response is displayed
- API failure is handled

## 6. Weather

Test:
- City can be selected
- Temperature is displayed
- API error is handled

## 7. Login

Test:
- Empty fields are rejected
- Invalid credentials are rejected
- Valid credentials log in

## 8. Trip

Test:
- Trip can be created
- Trip is saved to MySQL
- Trip can be displayed
- Trip can be deleted

## 9. Itinerary

Test:
- Activity can be added
- Activity appears under correct trip
- Activity can be deleted

## 10. Budget

Test:

```text
Travel + Hotel + Food + Activities + Other = Total
```

Verify the calculated total manually.

## 11. Responsive Design

Test at:

- Desktop
- Tablet
- Mobile

## 12. Basic Security Testing

Verify:

- API keys are not visible in React
- Passwords are hashed
- SQL queries use prepared statements
- User input is validated
