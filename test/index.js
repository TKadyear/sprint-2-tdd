const getTimeStamp = (date) => new Date(date).getTime();
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
  }
};
class Booking {
  constructor() {

  }
  getFee() {
  }
};
const totalOccupancyPercentage = ({ rooms, startDate, endDate }) => { };
const availableRooms = ({ rooms, startDate, endDate }) => { };
module.exports = { Room, Booking, totalOccupancyPercentage, availableRooms };
