const getTimeStamp = (date) => new Date(date).getTime();
const getDaysBetween = (startDate, endDate) => {
  const msPass = Math.abs(getTimeStamp(startDate) - getTimeStamp(endDate));
  const tiempo = 1000 * 60 * 60 * 24;
  return Math.round((msPass / tiempo))
};
const isInRange = ({ filterStartDate, filterEndDate, checkIn, checkOut }) => {
  const FilterStartDate = getTimeStamp(filterStartDate);
  const FilterEndDate = getTimeStamp(filterEndDate);
  const CheckIn = getTimeStamp(checkIn);
  const CheckOut = getTimeStamp(checkOut);
  const conditionCheckIn = CheckIn >= FilterStartDate && CheckIn <= FilterEndDate;
  const conditionCheckOut = CheckOut >= FilterStartDate && CheckOut <= FilterEndDate;
  const conditionInProgress = CheckIn <= FilterStartDate && CheckOut >= FilterEndDate;
  return (conditionCheckIn || conditionCheckOut || conditionInProgress);
};
class Room {
  constructor({ name, bookings, rate, discount }) {
    this.name = name; //String
    this.bookings = bookings; //Array
    this.rate = rate; //Number
    this.discount = discount; //Number
  }
  isOccupied(date) {
    const dateRequired = getTimeStamp(date);
    const findRoom = [...this.bookings].find(room => {
      const timeStampCheckIn = getTimeStamp(room.checkIn);
      const timeStampCheckOut = getTimeStamp(room.checkOut);
      if (timeStampCheckIn > dateRequired && dateRequired < timeStampCheckOut) {
        return room;
      };
    })
    return findRoom ? findRoom.name : false;
  }
  occupancyPercentage({ startDate, endDate }) {
    const totalDaysIsOccupied = [...this.bookings]
      .filter(room =>
        isInRange({ filterStartDate: startDate, filterEndDate: endDate, checkIn: room.checkIn, checkOut: room.checkOut }))
      .map(room => {
        if (getTimeStamp(room.checkOut) > getTimeStamp(endDate)) {
          return getDaysBetween(room.checkIn, endDate);
        }
        return getDaysBetween(room.checkIn, room.checkOut);
      })
      .reduce((prevValue, currentValue) => {
        return currentValue + prevValue;
      }, 0);
    const totalDaysFilter = getDaysBetween(startDate, endDate);
    console.error(totalDaysIsOccupied, totalDaysFilter)
    const result = Math.round((totalDaysIsOccupied / totalDaysFilter) * 100);
    return result;
  }
};
class Booking {
  constructor({ name, email, checkIn, checkOut, discount, room }) {
    this.name = name; //String
    this.email = email; //String
    this.checkIn = checkIn; //String/Date Format AAAA-MM-DDD
    this.checkOut = checkOut; //String/Date Format AAAA-MM-DDD
    this.discount = discount; //Number
    this.room = room; //Object
  }
  getFee() {
    const totalDiscount = this.discount + this.room.discount;
    const percentagePrice = totalDiscount < 100 ? (100 - totalDiscount) / 100 : 0;
    const result = this.room.rate * percentagePrice;
    return result;
  }
};
const totalOccupancyPercentage = ({ rooms, startDate, endDate }) => {
  console.error("------")
  const occupancyRooms = [...rooms].map(room => {
    console.log(room.occupancyPercentage({ startDate: startDate, endDate: endDate }))
    return room.occupancyPercentage({ startDate: startDate, endDate: endDate })
  });
  const totalDaysIsOccupied = occupancyRooms.reduce((prevValue, currentValue) => {
    return currentValue + prevValue;
  }, 0);
  const result = Math.round(totalDaysIsOccupied / rooms.length);
  console.log(totalDaysIsOccupied, rooms.length, result);
  return result;
};

const availableRooms = ({ rooms, startDate, endDate }) => {

  const available = [...rooms].filter(room => {
    const isValid = room.bookings.some(booked => isInRange({ filterStartDate: startDate, filterEndDate: endDate, checkIn: booked.checkIn, checkOut: booked.checkOut }) === true)
    return !isValid;
  });


  return available.length ? available : false;
};
module.exports = { Room, Booking, totalOccupancyPercentage, availableRooms };
