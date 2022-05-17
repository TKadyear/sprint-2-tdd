class Room {
  constructor() {

  }
  isOccupied(date) {
    return true;
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
