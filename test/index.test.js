const { Room, Booking, totalOccupancyPercentage, availableRooms } = require("./index")

const templateRoom = {
  name: "Ocean",
  bookings: [],
  rate: 2500,
  discount: 0
}
const templateBookings = {
  name: "Bertha Raynor",
  email: "berthaR@gmail.com",
  checkIn: "2022-05-17T12:53:14.850Z",
  checkOut: "2022-05-17T12:53:14.850Z",
  discount: 0,
  room: { ...templateRoom }
};

describe("class Room, method isOccupied", () => {
  test("If the room is not occupied and the booking array is empty", () => {
    //Arrange
    const room = new Room({ ...templateRoom });
    // Act
    const actualValue = room.isOccupied("2022-06-18");
    // Assert
    expect(actualValue).toBeFalsy();
  })
  test("If the room is not occupied", () => {
    const bookingList = [{ ...templateBookings, checkIn: "2022-06-10", checkOut: "2022-06-30" }, { ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" }]
    //Arrange
    const room = new Room({ ...templateRoom, bookings: bookingList });
    // Act
    const actualValue = room.isOccupied("2022-10-18");
    // Assert
    expect(actualValue).toBeFalsy();
  })
  test("If the room is occupied", () => {
    //Arrange
    const bookingList = [{ ...templateBookings, checkIn: "2022-06-10", checkOut: "2022-06-30" }, { ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" }]
    const room = new Room({ ...templateRoom, bookings: bookingList });
    const expectValue = "Bertha Raynor";
    // Act
    const actualValue = room.isOccupied("2022-06-18");
    // Assert
    expect(actualValue).toBe(expectValue);
  })
})

describe("class Room, method occupancyPercentage", () => {
  test("Check the  50 occupancyPercentage", () => {
    //Arrange
    const bookingList = [
      { ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" },
      { ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-30" },
      { ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" },
      { ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-11" },
    ]
    const room = new Room({ ...templateRoom, bookings: bookingList });
    const expectValue = 50;
    // Act
    const duration = { startDate: "2022-06-01", endDate: "2022-06-21" }
    const actualValue = room.occupancyPercentage({ ...duration });
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("Check the 75  occupancyPercentage", () => {
    //Arrange
    const bookingList = [
      { ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" },
      { ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-12" },
      { ...templateBookings, checkIn: "2022-06-17", checkOut: "2022-06-30" },
      { ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" },
      { ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" },
      { ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" }
    ]
    const room = new Room({ ...templateRoom, bookings: bookingList });
    const expectValue = 75; // 15days / 20 days is occupied = 0.75 , 0.75 * 100 = 75
    // Act
    const duration = { startDate: "2022-06-01", endDate: "2022-06-21" };
    const actualValue = room.occupancyPercentage({ ...duration });
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("Check the 100 occupancyPercentage", () => {
    //Arrange
    const bookingList = [
      { ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" },
      { ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-13" },
      { ...templateBookings, checkIn: "2022-06-17", checkOut: "2022-06-30" },
      { ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" },
      { ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" },
      { ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" }
    ]
    const room = new Room({ ...templateRoom, bookings: bookingList });
    const expectValue = 100; // 15days / 20 days is occupied = 0.75 , 0.75 * 100 = 75
    // Act
    const duration = { startDate: "2022-06-01", endDate: "2022-06-05" };
    const actualValue = room.occupancyPercentage({ ...duration });
    // Assert
    expect(actualValue).toBe(expectValue);
  })
})

describe("class Booking, method getFee", () => {
  test("Without any discounts", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings })
    const expectValue = 2500;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("With 25% discount of rooms", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, room: { ...templateRoom, discount: 25 } })
    const expectValue = 1875;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("With 50% discount of rooms", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, room: { ...templateRoom, discount: 50 } })
    const expectValue = 1250;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("Only with 20 discount of booking", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 20 })
    const expectValue = 2000;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("Only with 12 discount of booking", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 12 })
    const expectValue = 2200;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("With 25% discount rooms and 12% discount booking", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 12, room: { ...templateRoom, discount: 25 } })
    const expectValue = 1575;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("When the amount of the discounts is over 100", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 55, room: { ...templateRoom, discount: 75 } })
    const expectValue = 0;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  })
})

describe("Function totalOccupancyPercentage", () => {
  const bookingList = [
    { ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" },
    { ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-12" },
    { ...templateBookings, checkIn: "2022-06-17", checkOut: "2022-06-30" },
    { ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" },
    { ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" },
    { ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" }
  ];

  test("Check the totalOccupancyPercentage", () => {
    //Arrange
    const anotherBookingList = [
      { ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" },
      { ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-30" },
      { ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" },
      { ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-11" },
    ]

    const listRooms = [
      new Room({ ...templateRoom, bookings: bookingList }),
      new Room({ ...templateRoom, name: "Suite Sea", bookings: anotherBookingList })
    ];
    const expectValue = 63; // 75 + 50 (occupancy each room)= 125 , 125 / 2(quantity/amount ) = Math.round(62.5)
    const params = { rooms: [...listRooms], startDate: "2022-06-01", endDate: "2022-06-21" };
    // Act
    const actualValue = totalOccupancyPercentage(params);
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("When any room is occupied in that duration", () => {
    //Arrange
    const listRooms = [
      new Room({ ...templateRoom, bookings: bookingList }),
      new Room({ ...templateRoom, name: "Suite Sea", booking: bookingList })
    ];
    const expectValue = 0;
    const params = { rooms: [...listRooms], startDate: "2022-10-01", endDate: "2022-10-15" };
    // Act
    const actualValue = totalOccupancyPercentage(params);
    // Assert
    expect(actualValue).toBe(expectValue);
  })
  test("When all rooms are occupied in that duration", () => {
    //Arrange
    const listRooms = [
      new Room({ ...templateRoom, booking: bookingList }),
      new Room({ ...templateRoom, name: "Suite Sea", booking: bookingList })
    ];
    const expectValue = 100;
    const params = { rooms: [...listRooms], startDate: "2022-06-01", endDate: "2022-06-06" };
    // Act
    const actualValue = totalOccupancyPercentage(params);
    // Assert
    expect(actualValue).toBe(expectValue);
  })
})

describe.only("Function availableRooms", () => {


  const bookingList = [
    { ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-05" },
    { ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-11" },
    { ...templateBookings, checkIn: "2022-06-19", checkOut: "2022-06-30" },
    { ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" },
    { ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" },
    { ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" }
  ];
  const SuiteSeaBookingList = [
    { ...templateBookings, room: { ...templateRoom, name: "Suite Sea" }, checkIn: "2022-06-01", checkOut: "2022-06-05" },
    { ...templateBookings, room: { ...templateRoom, name: "Suite Sea" }, checkIn: "2022-06-10", checkOut: "2022-06-30" },
    { ...templateBookings, room: { ...templateRoom, name: "Suite Sea" }, checkIn: "2022-08-10", checkOut: "2022-08-30" }
  ]
  const OceanBlueBookingList = [
    { ...templateBookings, room: { ...templateRoom, name: "Ocean Blue" }, checkIn: "2022-06-01", checkOut: "2022-06-05" },
    { ...templateBookings, room: { ...templateRoom, name: "Ocean Blue" }, checkIn: "2022-06-10", checkOut: "2022-06-30" },
    { ...templateBookings, room: { ...templateRoom, name: "Ocean Blue" }, checkIn: "2022-08-10", checkOut: "2022-08-30" }
  ]

  test("Check the availables rooms", () => {
    //Arrange
    const room1 = new Room({ ...templateRoom, bookings: [...bookingList] });
    const room2 = new Room({ ...templateRoom, name: "Suite Sea", bookings: [...SuiteSeaBookingList] });
    const room3 = new Room({ ...templateRoom, name: "Ocean Blue", bookings: [...OceanBlueBookingList] });
    const listRooms = [room1, room2, room3];
    const expectValue = [room1, room2, room3];

    const params = { rooms: [...listRooms], startDate: "2022-07-06", endDate: "2022-06-09" };
    // Act
    const actualValue = availableRooms(params);
    // Assert
    expect(actualValue).toEqual(expectValue);
  })
  test("Edge case because the checkIn one of the booked room and the checkout of the params are the same day", () => {
    //Arrange
    const room1 = new Room({ ...templateRoom, bookings: [...bookingList] });
    const room2 = new Room({ ...templateRoom, name: "Suite Sea", bookings: [...SuiteSeaBookingList] });
    const room3 = new Room({ ...templateRoom, name: "Ocean Blue", bookings: [...OceanBlueBookingList] });
    const listRooms = [room1, room2, room3];
    const expectValue = [room2, room3];

    const params = { rooms: [...listRooms], startDate: "2022-06-06", endDate: "2022-06-10" };
    // Act
    const actualValue = availableRooms(params);
    // Assert
    expect(actualValue).toEqual(expectValue);
  })
  test("When any room is available", () => {
    //Arrange
    const room1 = new Room({ ...templateRoom, bookings: [...bookingList] });
    const room2 = new Room({ ...templateRoom, name: "Suite Sea", bookings: [...SuiteSeaBookingList] });
    const room3 = new Room({ ...templateRoom, name: "Ocean Blue", bookings: [...OceanBlueBookingList] });
    const listRooms = [room1, room2, room3];
    // const expectValue = [];

    const params = { rooms: [...listRooms], startDate: "2022-06-02", endDate: "2022-06-04" };
    // Act
    const actualValue = availableRooms(params);
    // Assert
    expect(actualValue).toBeFalsy();
  })
})
