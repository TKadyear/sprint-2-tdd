type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type N = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `20${zeroToNine}${zeroToNine}`;
type MM = `0${N}` | `1${0 | 1 | 2}`;
type DD = `${0 | 1 | 2}${N}` | `${3}${0 | 1}`;
type strDate = `${YYYY}-${MM}-${DD}`;

const getTimeStamp = (date: strDate): number => new Date(date).getTime();

const getDaysBetween = (startDate: strDate, endDate: strDate): number => {
  // ms => miliseconds
  const msPass = Math.abs(getTimeStamp(startDate) - getTimeStamp(endDate));
  const msToDays = 1000 * 60 * 60 * 24;
  return Math.round((msPass / msToDays));
};

const isInRange = ({ filterStartDate, filterEndDate, checkIn, checkOut }: { filterStartDate: strDate, filterEndDate: strDate, checkIn: strDate, checkOut: strDate }): boolean => {
  const FilterStartDate = getTimeStamp(filterStartDate);
  const FilterEndDate = getTimeStamp(filterEndDate);
  const CheckIn = getTimeStamp(checkIn);
  const CheckOut = getTimeStamp(checkOut);
  const conditionCheckIn = CheckIn >= FilterStartDate && CheckIn <= FilterEndDate;
  const conditionCheckOut = CheckOut >= FilterStartDate && CheckOut <= FilterEndDate;
  const conditionInProgress = CheckIn <= FilterStartDate && CheckOut >= FilterEndDate;
  return (conditionCheckIn || conditionCheckOut || conditionInProgress);
};

export interface room {
  name: string;
  bookingsList: Array<Booking>;
  rate: number;
  discount: number;
};

export class Room {
  name;
  bookingsList;
  rate;
  discount;

  constructor({ name, bookingsList, rate, discount }: room) {
    this.name = name;
    this.bookingsList = bookingsList;
    this.rate = rate;
    this.discount = discount;
  }

  isOccupied(date: strDate): string | boolean {
    const dateRequired = getTimeStamp(date);
    const findRoom = [...this.bookingsList].find(room => {
      const timeStampCheckIn = getTimeStamp(room.checkIn);
      const timeStampCheckOut = getTimeStamp(room.checkOut);
      if (timeStampCheckIn > dateRequired && dateRequired < timeStampCheckOut) {
        return room;
      };
    })
    return findRoom ? findRoom.name : false;
  }

  occupancyPercentage({ startDate, endDate }: { startDate: strDate, endDate: strDate }): number {
    const totalDaysIsOccupied = this.bookingsList
      .filter(room => isInRange({ filterStartDate: startDate, filterEndDate: endDate, checkIn: room.checkIn, checkOut: room.checkOut }))
      .map(room => {
        if (getTimeStamp(room.checkOut) > getTimeStamp(endDate)) {
          return getDaysBetween(room.checkIn, endDate);
        }
        return getDaysBetween(room.checkIn, room.checkOut);
      })
      .reduce((prevValue, currentValue) => currentValue + prevValue, 0);

    const totalDaysFilter = getDaysBetween(startDate, endDate);
    const result = Math.round((totalDaysIsOccupied / totalDaysFilter) * 100);
    return result;
  }
};
export interface roomBooked {
  name: string,
  email: string,
  checkIn: strDate,
  checkOut: strDate,
  discount: number,
  room: Room
};

export class Booking implements roomBooked {
  name;
  email;
  checkIn;
  checkOut;
  discount;
  room;

  constructor({ name, email, checkIn, checkOut, discount, room }: roomBooked) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }

  getFee() {
    const totalDiscount = this.discount + this.room.discount;
    const percentagePrice = totalDiscount < 100 ? (100 - totalDiscount) / 100 : 0;
    const result = this.room.rate * percentagePrice;
    return result;
  }
};

export const totalOccupancyPercentage = ({ rooms, startDate, endDate }: { rooms: Array<Room>, startDate: strDate, endDate: strDate }) => {
  const totalDaysIsOccupied = rooms
    .map(room => room.occupancyPercentage({ startDate: startDate, endDate: endDate }))
    .reduce((prevValue, currentValue) => {
      return currentValue + prevValue;
    }, 0);
  const result = Math.round(totalDaysIsOccupied / rooms.length);
  return result;
};

export const availableRooms = ({ rooms, startDate, endDate }: { rooms: Array<Room>, startDate: strDate, endDate: strDate }): Array<Room> | boolean => {
  const available = rooms.filter(room => {

    const isValid = room.bookingsList.some(booked => isInRange({ filterStartDate: startDate, filterEndDate: endDate, checkIn: booked.checkIn, checkOut: booked.checkOut }) === true)
    return !isValid;
  });
  return available.length ? available : false;
};
