import { Room, Booking, totalOccupancyPercentage, availableRooms, IRoomBooked, IRoom, strDate } from "./index";
const templateRoom: IRoom = {
  name: "Ocean",
  bookingsList: [],
  rate: 2500,
  discount: 0,
};
const templateBookings: IRoomBooked = {
  name: "Bertha Raynor",
  email: "berthaR@gmail.com",
  checkIn: "2022-05-17",
  checkOut: "2022-05-17",
  discount: 0,
  room: new Room({ ...templateRoom }),
};

describe("class Room, method isOccupied", () => {
  test("If the room is not occupied and the booking array is empty", () => {
    //Arrange
    const room = new Room({ ...templateRoom });
    // Act
    const actualValue = room.isOccupied("2022-06-18");
    // Assert
    expect(actualValue).toBeFalsy();
  });
  test("If the room is not occupied", () => {
    const bookingList = [
      new Booking({ ...templateBookings, checkIn: "2022-06-10", checkOut: "2022-06-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" })
    ];
    //Arrange
    const room = new Room({ ...templateRoom, bookingsList: bookingList });
    // Act
    const actualValue = room.isOccupied("2022-10-18");
    // Assert
    expect(actualValue).toBeFalsy();
  });
  test("If the room is occupied", () => {
    //Arrange
    const bookingList = [
      new Booking({ ...templateBookings, checkIn: "2022-06-10", checkOut: "2022-06-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" })
    ];
    const room = new Room({ ...templateRoom, bookingsList: bookingList });
    const expectValue = "Bertha Raynor";
    // Act
    const actualValue = room.isOccupied("2022-06-18");
    // Assert
    expect(actualValue).toBe(expectValue);
  });
});

describe("class Room, method occupancyPercentage", () => {
  test("Check the  50 occupancyPercentage", () => {
    //Arrange
    const bookingList = [
      new Booking({ ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-11" }),
    ];
    const room = new Room({ ...templateRoom, bookingsList: bookingList });
    const expectValue = 50;
    // Act
    const duration: { startDate: strDate, endDate: strDate } = { startDate: "2022-06-01", endDate: "2022-06-21" };
    const actualValue = room.occupancyPercentage({ ...duration });
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("Check the 75  occupancyPercentage", () => {
    //Arrange
    const bookingList = [
      new Booking({ ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" }),
      new Booking({ ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-12" }),
      new Booking({ ...templateBookings, checkIn: "2022-06-17", checkOut: "2022-06-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" })
    ];
    const room = new Room({ ...templateRoom, bookingsList: bookingList });
    const expectValue = 75; // 15days / 20 days is occupied = 0.75 , 0.75 * 100 = 75
    // Act
    const duration: { startDate: strDate, endDate: strDate } = { startDate: "2022-06-01", endDate: "2022-06-21" };
    const actualValue = room.occupancyPercentage({ ...duration });
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("Check the 100 occupancyPercentage", () => {
    //Arrange
    const bookingListTemplate = [
      new Booking({ ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" }),
      new Booking({ ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-13" }),
      new Booking({ ...templateBookings, checkIn: "2022-06-17", checkOut: "2022-06-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" })
    ];
    const room = new Room({ ...templateRoom, bookingsList: bookingListTemplate });
    const expectValue = 100; // 15days / 20 days is occupied = 0.75 , 0.75 * 100 = 75
    // Act
    const duration: { startDate: strDate, endDate: strDate } = { startDate: "2022-06-01", endDate: "2022-06-05" };
    const actualValue = room.occupancyPercentage({ ...duration });
    // Assert
    expect(actualValue).toBe(expectValue);
  });
});

describe("class Booking, method getFee", () => {
  test("Without any discounts", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings });
    const expectValue = 2500;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("With 25% discount of rooms", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, room: new Room({ ...templateRoom, discount: 25 }) });
    const expectValue = 1875;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("With 50% discount of rooms", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, room: new Room({ ...templateRoom, discount: 50 }) });
    const expectValue = 1250;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("Only with 20 discount of booking", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 20 });
    const expectValue = 2000;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("Only with 12 discount of booking", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 12 });
    const expectValue = 2200;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("With 25% discount rooms and 12% discount booking", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 12, room: new Room({ ...templateRoom, discount: 25 }) });
    const expectValue = 1575;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("When the amount of the discounts is over 100", () => {
    //Arrange
    const booking = new Booking({ ...templateBookings, discount: 55, room: new Room({ ...templateRoom, discount: 75 }) });
    const expectValue = 0;
    // Act
    const actualValue = booking.getFee();
    // Assert
    expect(actualValue).toBe(expectValue);
  });
});

describe("Function totalOccupancyPercentage", () => {
  const bookingListTemplate = [
    new Booking({ ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" }),
    new Booking({ ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-12" }),
    new Booking({ ...templateBookings, checkIn: "2022-06-17", checkOut: "2022-06-30" }),
    new Booking({ ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" }),
    new Booking({ ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" }),
    new Booking({ ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" })
  ];

  test("Check the totalOccupancyPercentage", () => {
    //Arrange
    const anotherBookingList = [
      new Booking({ ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-06" }),
      new Booking({ ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" }),
      new Booking({ ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-11" }),
    ];

    const listRooms = [
      new Room({ ...templateRoom, bookingsList: bookingListTemplate }),
      new Room({ ...templateRoom, name: "Suite Sea", bookingsList: anotherBookingList })
    ];
    const expectValue = 63; // 75 + 50 (occupancy each room)= 125 , 125 / 2(quantity/amount ) = Math.round(62.5)
    const params: { rooms: Array<Room>, startDate: strDate, endDate: strDate } = { rooms: [...listRooms], startDate: "2022-06-01", endDate: "2022-06-21" };
    // Act
    const actualValue = totalOccupancyPercentage(params);
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test("When any room is occupied in that duration", () => {
    //Arrange
    const listRooms = [
      new Room({ ...templateRoom, bookingsList: bookingListTemplate }),
      new Room({ ...templateRoom, name: "Suite Sea", bookingsList: bookingListTemplate })
    ];
    const expectValue = 0;
    const params: { rooms: Array<Room>, startDate: strDate, endDate: strDate } = { rooms: [...listRooms], startDate: "2022-10-01", endDate: "2022-10-15" };
    // Act
    const actualValue = totalOccupancyPercentage(params);
    // Assert
    expect(actualValue).toBe(expectValue);
  });
  test.skip("When all rooms are occupied in that duration", () => {
    //Arrange
    const listRooms = [
      new Room({ ...templateRoom, bookingsList: bookingListTemplate }),
      new Room({ ...templateRoom, name: "Suite Sea", bookingsList: bookingListTemplate })
    ];
    const expectValue = 100;
    const params: { rooms: Array<Room>, startDate: strDate, endDate: strDate } = { rooms: [...listRooms], startDate: "2022-06-01", endDate: "2022-06-06" };
    // Act
    const actualValue = totalOccupancyPercentage(params);
    // Assert
    expect(actualValue).toBe(expectValue);
  });
});

describe("Function availableRooms", () => {
  const bookingList = [
    new Booking({ ...templateBookings, checkIn: "2022-06-01", checkOut: "2022-06-05" }),
    new Booking({ ...templateBookings, checkIn: "2022-06-06", checkOut: "2022-06-11" }),
    new Booking({ ...templateBookings, checkIn: "2022-06-19", checkOut: "2022-06-30" }),
    new Booking({ ...templateBookings, checkIn: "2022-07-10", checkOut: "2022-07-19" }),
    new Booking({ ...templateBookings, checkIn: "2022-07-20", checkOut: "2022-08-30" }),
    new Booking({ ...templateBookings, checkIn: "2022-08-10", checkOut: "2022-08-30" })
  ];
  const SuiteSeaBookingList = [
    new Booking({ ...templateBookings, room: new Room({ ...templateRoom, name: "Suite Sea" }), checkIn: "2022-06-01", checkOut: "2022-06-05" }),
    new Booking({ ...templateBookings, room: new Room({ ...templateRoom, name: "Suite Sea" }), checkIn: "2022-06-10", checkOut: "2022-06-30" }),
    new Booking({ ...templateBookings, room: new Room({ ...templateRoom, name: "Suite Sea" }), checkIn: "2022-08-10", checkOut: "2022-08-30" })
  ];
  const OceanBlueBookingList = [
    new Booking({ ...templateBookings, room: new Room({ ...templateRoom, name: "Ocean Blue" }), checkIn: "2022-06-01", checkOut: "2022-06-05" }),
    new Booking({ ...templateBookings, room: new Room({ ...templateRoom, name: "Ocean Blue" }), checkIn: "2022-06-10", checkOut: "2022-06-30" }),
    new Booking({ ...templateBookings, room: new Room({ ...templateRoom, name: "Ocean Blue" }), checkIn: "2022-08-10", checkOut: "2022-08-30" })
  ];

  test("Check the availables rooms", () => {
    //Arrange
    const room1 = new Room({ ...templateRoom, bookingsList: [...bookingList] });
    const room2 = new Room({ ...templateRoom, name: "Suite Sea", bookingsList: [...SuiteSeaBookingList] });
    const room3 = new Room({ ...templateRoom, name: "Ocean Blue", bookingsList: [...OceanBlueBookingList] });
    const listRooms = [room1, room2, room3];
    const expectValue = [room1, room2, room3];

    const params: { rooms: Array<Room>, startDate: strDate, endDate: strDate } = { rooms: [...listRooms], startDate: "2022-10-06", endDate: "2022-10-09" };
    // Act
    const actualValue = availableRooms(params);
    // Assert
    expect(actualValue).toEqual(expectValue);
  });
  test("Edge case because the checkIn one of the booked room and the checkout of the params are the same day", () => {
    //Arrange
    const room1 = new Room({ ...templateRoom, bookingsList: [...bookingList] });
    const room2 = new Room({ ...templateRoom, name: "Suite Sea", bookingsList: [...SuiteSeaBookingList] });
    const room3 = new Room({ ...templateRoom, name: "Ocean Blue", bookingsList: [...OceanBlueBookingList] });
    const listRooms = [room1, room2, room3];

    const params: { rooms: Array<Room>, startDate: strDate, endDate: strDate } = { rooms: [...listRooms], startDate: "2022-06-06", endDate: "2022-06-10" };
    // Act
    const actualValue = availableRooms(params);
    // Assert
    expect(actualValue).toBeFalsy();
  });
  test("When any room is available", () => {
    //Arrange
    const room1 = new Room({ ...templateRoom, bookingsList: [...bookingList] });
    const room2 = new Room({ ...templateRoom, name: "Suite Sea", bookingsList: [...SuiteSeaBookingList] });
    const room3 = new Room({ ...templateRoom, name: "Ocean Blue", bookingsList: [...OceanBlueBookingList] });
    const listRooms = [room1, room2, room3];

    const params: { rooms: Array<Room>, startDate: strDate, endDate: strDate } = { rooms: [...listRooms], startDate: "2022-06-02", endDate: "2022-06-04" };
    // Act
    const actualValue = availableRooms(params);
    // Assert
    expect(actualValue).toBeFalsy();
  });
});
