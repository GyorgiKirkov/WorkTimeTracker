import React, { useMemo } from 'react';
import './MonthEntries.module.css';

interface Entry {
  date: string;
  startHour: string;
  endHour: string;
  breakTime: number; 
  nightShiftIncrease: number;
  nightShiftStart: string;
  nightShiftEnd: string;
  hoursWorked: string;
  dailyWage: string;
}

interface MonthEntriesProps {
  month: string;
  entries: Entry[];
  onBack: () => void;
  onEditEntry: (index: number) => void;
  onDeleteEntry: (index: number) => void;
}

const MonthEntries: React.FC<MonthEntriesProps> = ({
  month,
  entries,
  onBack,
  onEditEntry,
  onDeleteEntry,
}) => {
  const handleEdit = (index: number) => {
    onEditEntry(index);
  };

  const handleDelete = (index: number) => {
    onDeleteEntry(index);
  };

  const totalHoursWorked = useMemo(() => {
    return entries
      .reduce((total, entry) => total + parseFloat(entry.hoursWorked), 0)
      .toFixed(2);
  }, [entries]);

  const totalWageEarned = useMemo(() => {
    return entries
      .reduce((total, entry) => total + parseFloat(entry.dailyWage), 0)
      .toFixed(2);
  }, [entries]);

  return (
    <div className="p-3">
      <h2 className="text-center text-white">
        {month.charAt(0).toUpperCase() + month.slice(1)} -{' '}
        <span className="text-warning">Total Hours: {totalHoursWorked} </span>/{' '}
        <span className="text-danger"> Total Wage: {totalWageEarned}€</span>
      </h2>
      <div className="table-responsive">
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Hour</th>
              <th>End Hour</th>
              <th>Pause</th>
              <th>Night Shift %</th>
              <th>% Start</th>
              <th>% End</th>
              <th>Total Hours</th>
              <th>Daily Wage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.startHour}</td>
                <td>{entry.endHour}</td>
                <td>{entry.breakTime}</td>
                <td>{entry.nightShiftIncrease}%</td>
                <td>{entry.nightShiftStart}</td>
                <td>{entry.nightShiftEnd}</td>
                <td>{entry.hoursWorked}</td>
                <td>{entry.dailyWage}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm "
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm "
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-group text-center">
        <button className="btn btn-outline-secondary text-white d-grid gap-2 col-6 mx-auto" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default MonthEntries;
