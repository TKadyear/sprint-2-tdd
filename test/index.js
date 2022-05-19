const getTimeStamp = (date) => new Date(date).getTime();
const getDays = (date) => getTimeStamp(date) * 1000 * 60 * 60 * 24;
const getDaysBetween = (startDate, endDate) => getDays(endDate) - getDays(startDate);
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
    console.log(bookedRoomInThatRange);
    const listDurationBooked = bookedRoomInThatRange.map(room => {
      const days = getDaysBetween(room.checkIn, room.checkOut);
      console.log(days)
      return days;
    });
    const totalDaysIsOccupied = listDurationBooked.reduce((prevValue, currentValue) => {
      // console.log(prevValue, "dia anterior")
      // console.log(currentValue, "dia posterior")
      return currentValue - prevValue;
    }, listDurationBooked[0]);
    const totalDaysFilter = getDaysBetween(startDate, endDate);
    // console.log(totalDaysIsOccupied, "Total ocupado");
    // console.log(totalDaysFilter, "Dias del filtro");
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
    const priceRoom = this.room.rate;
    // if (this.discount === 0 && this.room.discount === 0) {
    //   return priceRoom;
    // }
    const totalDiscount = this.discount + this.room.discount;
    const percentagePrice = totalDiscount < 100 ? (100 - totalDiscount) / 100 : 0;
    const result = priceRoom * percentagePrice;
    return result;
  }
};
const totalOccupancyPercentage = ({ rooms, startDate, endDate }) => { };
const availableRooms = ({ rooms, startDate, endDate }) => { };
module.exports = { Room, Booking, totalOccupancyPercentage, availableRooms };
