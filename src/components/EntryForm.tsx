import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface EntryFormProps {
  month: string;
  year: number;
  onAddEntry: (entry: Entry) => void;
  onBack: () => void;
  initialData?: Entry | null;
}

interface Entry {
  date: string;
  startHour: string;
  endHour: string;
  breakTime: number;
  wage: number;
  isPublicHoliday: boolean;
  nightShiftIncrease: number;
  nightShiftStart: string;
  nightShiftEnd: string;
  hoursWorked: string;
  dailyWage: string;
}

const EntryForm: React.FC<EntryFormProps> = ({
  month,
  year,
  onAddEntry,
  onBack,
  initialData,
}) => {
  const [day, setDay] = useState(initialData?.date.split("-")[2] || "");
  const [startHour, setStartHour] = useState(initialData?.startHour || "");
  const [endHour, setEndHour] = useState(initialData?.endHour || "");
  const [breakTime, setBreakTime] = useState(initialData?.breakTime || 0);
  const [wage, setWage] = useState(initialData?.wage || 0);
  const [isPublicHoliday, setIsPublicHoliday] = useState(
    initialData?.isPublicHoliday ? "yes" : "no"
  );
  const [nightShiftIncrease, setNightShiftIncrease] = useState(
    initialData?.nightShiftIncrease || 15
  );
  const [nightShiftStart, setNightShiftStart] = useState(
    initialData?.nightShiftStart || "20:00"
  );
  const [nightShiftEnd, setNightShiftEnd] = useState(
    initialData?.nightShiftEnd || "06:00"
  );
  const [step, setStep] = useState(1);

  const generateId = () => `id-${uuidv4()}`;
  const dayId = generateId();
  const startHourId = generateId();
  const endHourId = generateId();
  const breakTimeId = generateId();
  const wageId = generateId();
  const publicHolidayId = generateId();
  const nightShiftIncreaseId = generateId();
  const nightShiftStartId = generateId();
  const nightShiftEndId = generateId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!day || parseInt(day, 10) < 1 || parseInt(day, 10) > 31) {
      alert("Please enter a valid day.");
      return;
    }

    if (!startHour || !endHour) {
      alert("Please enter valid start and end hours.");
      return;
    }

    const hoursWorked = calculateHoursWorked(startHour, endHour, breakTime);
    if (hoursWorked <= 0) {
      alert("End time must be after start time, considering the break time.");
      return;
    }

    const dailyWage = calculateDailyWage(
      wage,
      isPublicHoliday === "yes",
      nightShiftIncrease,
      nightShiftStart,
      nightShiftEnd
    );

    const entry: Entry = {
      date: `${year}-${
        month.charAt(0).toUpperCase() + month.slice(1)
      }-${day.padStart(2, "0")}`,
      startHour,
      endHour,
      breakTime,
      wage,
      isPublicHoliday: isPublicHoliday === "yes",
      nightShiftIncrease,
      nightShiftStart,
      nightShiftEnd,
      hoursWorked: (hoursWorked / 60).toFixed(2),
      dailyWage: dailyWage.toFixed(2),
    };

    onAddEntry(entry);
    clearForm();
  };

  const calculateHoursWorked = (
    startHour: string,
    endHour: string,
    breakTime: number
  ): number => {
    let start = new Date(`1970-01-01T${startHour}:00`);
    let end = new Date(`1970-01-01T${endHour}:00`);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    let minutesWorked =
      (end.getTime() - start.getTime()) / 1000 / 60 - breakTime;
    return minutesWorked < 0 ? 0 : minutesWorked;
  };

  const calculateDailyWage = (
    wage: number,
    isPublicHoliday: boolean,
    nightShiftIncrease: number,
    nightShiftStart: string,
    nightShiftEnd: string
  ): number => {
    let start = new Date(`1970-01-01T${startHour}:00`);
    let end = new Date(`1970-01-01T${endHour}:00`);
    let nightStart = new Date(`1970-01-01T${nightShiftStart}:00`);
    let nightEnd = new Date(`1970-01-02T${nightShiftEnd}:00`);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    let totalWage = 0;
    let current = start;

    while (current < end) {
      let next = new Date(current);
      next.setMinutes(current.getMinutes() + 1);

      if (
        (current >= nightStart && current < nightEnd) ||
        (next > nightStart && next <= nightEnd)
      ) {
        totalWage += wage / 60 + (wage / 60) * (nightShiftIncrease / 100);
      } else {
        totalWage += wage / 60;
      }

      current.setMinutes(current.getMinutes() + 1);
    }

    totalWage = totalWage - (wage / 60) * (breakTime / 60);

    if (isPublicHoliday) {
      totalWage *= 2;
    }

    return totalWage;
  };

  const clearForm = () => {
    setDay("");
    setStartHour("");
    setEndHour("");
    setBreakTime(0);
    setWage(0);
    setIsPublicHoliday("no");
    setNightShiftIncrease(15);
    setNightShiftStart("20:00");
    setNightShiftEnd("06:00");
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-group">
            <label htmlFor={dayId}>Day:</label>
            <input
              type="number"
              id={dayId}
              className="form-control"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              min="1"
              max="31"
              placeholder="Enter day of the month"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
              >
                Next
              </button>
              <button
                type="button"
                className="btn btn-secondary "
                onClick={onBack}
              >
                Back
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-group">
            <label htmlFor={startHourId}>Start Hour:</label>
            <input
              type="time"
              id={startHourId}
              className="form-control"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              placeholder="HH:MM"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-group">
            <label htmlFor={endHourId}>End Hour:</label>
            <input
              type="time"
              id={endHourId}
              className="form-control"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              placeholder="HH:MM"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(4)}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-group">
            <label htmlFor={breakTimeId}>Break Time:</label>
            <input
              type="number"
              id={breakTimeId}
              className="form-control"
              value={breakTime}
              onChange={(e) => setBreakTime(parseInt(e.target.value, 10))}
              min="0"
              placeholder="Enter break time in minutes"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(3)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(5)}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="form-group">
            <label htmlFor={wageId}>Hourly Wage:</label>
            <input
              type="number"
              id={wageId}
              className="form-control"
              value={wage}
              onChange={(e) => setWage(parseFloat(e.target.value))}
              min="0"
              placeholder="Enter hourly wage"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(4)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(6)}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="form-group">
            <label htmlFor={publicHolidayId}>Is it a public holiday?</label>
            <select
              id={publicHolidayId}
              className="form-control"
              value={isPublicHoliday}
              onChange={(e) => setIsPublicHoliday(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(5)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(7)}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="form-group">
            <label htmlFor={nightShiftIncreaseId}>
              Night Shift Increase (%):
            </label>
            <input
              type="number"
              id={nightShiftIncreaseId}
              className="form-control"
              value={nightShiftIncrease}
              onChange={(e) =>
                setNightShiftIncrease(parseInt(e.target.value, 10))
              }
              min="0"
              placeholder="Enter night shift increase percentage"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(6)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(8)}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="form-group">
            <label htmlFor={nightShiftStartId}>Night Shift Start:</label>
            <input
              type="time"
              id={nightShiftStartId}
              className="form-control"
              value={nightShiftStart}
              onChange={(e) => setNightShiftStart(e.target.value)}
              placeholder="HH:MM"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(7)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(9)}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="form-group">
            <label htmlFor={nightShiftEndId}>Night Shift End:</label>
            <input
              type="time"
              id={nightShiftEndId}
              className="form-control"
              value={nightShiftEnd}
              onChange={(e) => setNightShiftEnd(e.target.value)}
              placeholder="HH:MM"
              required
            />
            <div className="form-group text-center">
              <button
                type="button"
                className="btn btn-secondary  d-grid gap-2 col-6 mx-auto"
                onClick={() => setStep(8)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <form>{renderFormStep()}</form>;
};

export default EntryForm;
