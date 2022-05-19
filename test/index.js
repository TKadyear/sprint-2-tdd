const getTimeStamp = (date) => new Date(date).getTime();
const getDaysBetween = (startDate, endDate) => {
  const msPass = Math.abs(getTimeStamp(startDate) - getTimeStamp(endDate));
  const tiempo = 1000 * 60 * 60 * 24;
  return Math.round((msPass / tiempo))
};
;
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
    const bookedRoomInThatRange = [...this.bookings].filter(room => {
      const FilterStartDate = getTimeStamp(startDate);
      const FilterEndDate = getTimeStamp(endDate);
      const CheckIn = getTimeStamp(room.checkIn);
      const CheckOut = getTimeStamp(room.checkOut);
      const conditionCheckIn = CheckIn >= FilterStartDate && CheckIn <= FilterEndDate;
      const conditionCheckOut = CheckOut >= FilterStartDate && CheckOut <= FilterEndDate;
      const conditionInProgress = CheckIn <= FilterStartDate && CheckOut >= FilterEndDate;
      return (conditionCheckIn || conditionCheckOut || conditionInProgress);
    });
    const listDurationBooked = bookedRoomInThatRange.map(room => {
      if (getTimeStamp(room.checkOut) > getTimeStamp(endDate)) {
        return getDaysBetween(room.checkIn, endDate);
      }
      return getDaysBetween(room.checkIn, room.checkOut);
    });
    const totalDaysIsOccupied = listDurationBooked.reduce((prevValue, currentValue) => {
      return currentValue + prevValue;
    }, 0);
    const totalDaysFilter = getDaysBetween(startDate, endDate) + 1;
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
const totalOccupancyPercentage = ({ rooms, startDate, endDate }) => { };
const availableRooms = ({ rooms, startDate, endDate }) => { };
module.exports = { Room, Booking, totalOccupancyPercentage, availableRooms };
