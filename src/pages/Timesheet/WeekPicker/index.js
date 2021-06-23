import React, {useEffect, useState} from "react";
import "./index.scss";
import "react-day-picker/lib/style.css";
import DayPicker from "react-day-picker";
import moment from "moment";


// Default selected week is based on today or you can pass initialSelected as moment obj to select the week based on that day

const WeekPicker = props => {

  // eslint-disable-next-line react/prop-types
  const { selectedDays, setSelectedDays, onWeekSelectedHandler, initialSelected } = props;
  const [hoverRange, setHoverRange] = useState(undefined);
  const initDay = initialSelected || moment();
  const initMonth = new Date(initDay.format("YYYY-MM"));


  useEffect(() => {
    const dayRange = getWeekDays(getWeekRange(initDay).from);
    setSelectedDays(dayRange);
  },[]);

  const getWeekDays = weekStart => {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
      days.push(
          moment(weekStart)
              .add(i, "days")
              .toDate()
      );
    }
    return days;
  };

  // May need to be used in parents component
  const getWeekRange = date => {
    return {
      from: moment(date)
          .startOf("week")
          .toDate(),
      to: moment(date)
          .endOf("week")
          .toDate(),
    };
  };

  const handleDayChange = async date => {
    const weekRange = getWeekRange(date);
    const dayRange = getWeekDays(weekRange.from);
    setSelectedDays(dayRange);
    if (onWeekSelectedHandler) {
      await onWeekSelectedHandler(weekRange);
    }
  };

  const handleDayEnter = date => {
    setHoverRange(getWeekRange(date));
  };

  const handleDayLeave = () => {
    setHoverRange(undefined);
  };

  const handleWeekClick = async (weekNumber, days, e) => {
    const weekRange = getWeekRange(days[0]);
    setSelectedDays(days);
    if (onWeekSelectedHandler) {
      await onWeekSelectedHandler(weekRange);
    }
  };

  // eslint-disable-next-line react/prop-types
  const daysAreSelected = selectedDays.length > 0;

  const modifiers = {
    hoverRange,
    selectedRange: daysAreSelected && {
      from: selectedDays[0],
      to: selectedDays[6],
    },
    hoverRangeStart: hoverRange && hoverRange.from,
    hoverRangeEnd: hoverRange && hoverRange.to,
    selectedRangeStart: daysAreSelected && selectedDays[0],
    selectedRangeEnd: daysAreSelected && selectedDays[6],
  };

  return (
      <div className="week-picker-container">
        <DayPicker
            month={initMonth}
            selectedDays={selectedDays}
            showWeekNumbers
            showOutsideDays
            modifiers={modifiers}
            onDayClick={handleDayChange}
            onDayMouseEnter={handleDayEnter}
            onDayMouseLeave={handleDayLeave}
            onWeekClick={handleWeekClick}
        />
      </div>
  );
};

export default WeekPicker;
