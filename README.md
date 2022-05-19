# Sprint 2 - Test Driven Development

## Requirements
Make the next class with the methods:
- Room
  -  Properties:
       -  Name - string
       -  Bookings - array of Booking objects in this room
       -  Rate - ``int price in cents``
       -  Discount - ``int percentage``

    - Methods:
      -  isOccupied(date) returns false if not occupied, returns the guest if occupied
      -  occupancyPercentage(startDate, endDate) returns the percentage of days with occupancy within the range of dates provided (inclusive)
- Booking
    - Properties:
      -  Name - string
      -  Email - string
      -  Check in - date
      -  Check out - date
      -  Discount - ``int percentage``
      -  Room - a room object
    - Methods:
      -  get fee() returns the fee, including discounts on room and guest

Also create the next functions:
- totalOccupancyPercentage(rooms, startDate, endDate) returns the total occupancy percentage across all rooms in the array
- availableRooms(rooms, startDate, endDate) returns all rooms in the array that are not occupied for the entire duration


## Examples test
### class Room
1) Method isOccupied
  ```
  If the room is not occupied
  Room.isOccupied(date) => false

  If the room is occupied
  Room.isOccupied(date) => "Full Name of the Guest"
  ```
2) Method occupancyPercentage
  ```
  Room.occupancyPercentage(startDate, endDate) => 90(number)
  ```
When can this method fail?
### class Booking
1) Method getFee
  ```
  Without any discounts
  rateRoom = 20
  discountRoom = 0
  discountBooking = 0
  Booking.getfee() => 20
  ```
  ```
  With discount of room
  rateRoom = 20
  discountRoom = 50
  discountBooking = 0
  Booking.getfee() => 10
  ```
  ```
  With discount of booking
  rateRoom = 20
  discountRoom = 0
  discountBooking = 25
  Booking.getfee() => 15
  ```
  ```
  With discount of room and booking
  rateRoom = 20
  discountRoom = 50
  discountBooking = 25
  Booking.getfee() => 5
  ```
  ```
  When the amount of the discounts is over 100
  rateRoom = 20
  discountRoom = 55
  discountBooking = 75
  Booking.getfee() => 0
  ```
### Function totalOccupancyPercentage
  ```
  rooms = [list of all rooms]
  startDate = "AAAA/MM/DD"
  endDate = "AAAA/MM/DD"
  totalOccupancyPercentage(rooms, startDate, endDate)  => 35 //int percentage
  ```
  ```
  When any room is occupied in that duration
  rooms = [list of all rooms]
  startDate = "AAAA/MM/DD"
  endDate = "AAAA/MM/DD"
  totalOccupancyPercentage(rooms, startDate, endDate)  => 0 //int percentage
  ```
  ```
  When all rooms are occupied in that duration
  rooms = [list of all rooms]
  startDate = "AAAA/MM/DD"
  endDate = "AAAA/MM/DD"
  totalOccupancyPercentage(rooms, startDate, endDate)  => 100 //int percentage
  ```
### Function availableRooms
NOTE : ``The date of the check out counts like a one day less``
  ```
  rooms = [list of all rooms]
  startDate = "AAAA/MM/DD"
  endDate = "AAAA/MM/DD"
  totalOccupancyPercentage(rooms, startDate, endDate)  => [list of all Rooms that are not occupied]
  ```
  ```
  When any room is available
  rooms = [list of all rooms]
  startDate = "AAAA/MM/DD"
  endDate = "AAAA/MM/DD"
  totalOccupancyPercentage(rooms, startDate, endDate)  => false
  ```

