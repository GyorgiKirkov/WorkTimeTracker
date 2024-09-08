import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import appStyles from "./App.module.css";
import EntryForm from "./components/EntryForm";
import MonthCard from "./components/MonthCard/MonthCard";
import MonthEntries from "./components/MonthEntries/MonthEntries";
import LoginForm from "./components/LoginForm/LoginForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import DigitalClock from "./components/DigitalClock/DigitalClock";

interface Entry {
  date: string;
  startHour: string;
  endHour: string;
  breakTime: number; // Now in minutes
  wage: number;
  isPublicHoliday: boolean;
  nightShiftIncrease: number;
  nightShiftStart: string;
  nightShiftEnd: string;
  hoursWorked: string;
  dailyWage: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState("login");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear] = useState(new Date().getFullYear());
  const [entries, setEntries] = useState<{ [key: string]: Entry[] }>({});
  const [editIndex, setEditIndex] = useState(-1);
  const [currentUser, setCurrentUser] = useState<string | null>(
    localStorage.getItem("currentUser")
  );
  const [isWorking, setIsWorking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pauseTime, setPauseTime] = useState<Date | null>(null);
  const [totalPausedMinutes, setTotalPausedMinutes] = useState(0);
  const [initialEntryData, setInitialEntryData] = useState<Entry | null>(null);
  const [punchInWage, setPunchInWage] = useState<number>(0);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    if (currentUser) {
      loadEntriesFromLocalStorage(currentUser);
      setCurrentView("home");
    }
  }, [currentUser]);

  useEffect(() => {
    // Function to calculate luminance of a color
    const luminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      const a = [r, g, b].map(x => x / 255).reduce((a, b) => a + b) / 3;
      return a;
    };

    // Update CSS variables for card color
    const updateCardColors = () => {
      const textColor = luminance(backgroundColor) > 0.5 ? "#000000" : "#ffffff";
      document.documentElement.style.setProperty("--card-bg", backgroundColor);
      document.documentElement.style.setProperty("--card-text", textColor);
    };

    updateCardColors();

    // Change background color periodically
    const colors = ["#6a11cb", "#2575fc", "#8e2de2", "#4a00e0", "#00c6ff", "#0072ff"];
    let index = 0;
    const intervalId = setInterval(() => {
      setBackgroundColor(colors[index]);
      index = (index + 1) % colors.length;
    }, 60000); // Change color every 60 seconds

    return () => clearInterval(intervalId);
  }, [backgroundColor]);

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const loadEntriesFromLocalStorage = (email: string) => {
    const allEntries: { [key: string]: Entry[] } = {};
    months.forEach((month) => {
      allEntries[month] = JSON.parse(
        localStorage.getItem(`${email}_${month}`) || "[]"
      );
    });
    setEntries(allEntries);
  };

  const saveEntriesToLocalStorage = (
    entries: { [key: string]: Entry[] },
    email: string
  ) => {
    for (const month in entries) {
      localStorage.setItem(`${email}_${month}`, JSON.stringify(entries[month]));
    }
  };

  const handleMonthClick = (month: string) => {
    setCurrentMonth(month);
    setCurrentView("monthEntries");
  };

  const handleAddEntry = (entry: Entry) => {
    const newEntries = { ...entries };
    if (editIndex !== -1) {
      newEntries[currentMonth][editIndex] = entry;
    } else {
      newEntries[currentMonth].push(entry);
    }
    setEntries(newEntries);
    saveEntriesToLocalStorage(newEntries, currentUser!);
    setEditIndex(-1);
    setInitialEntryData(null);
    setCurrentView("monthEntries");
  };

  const handleEditEntry = (index: number) => {
    setEditIndex(index);
    setInitialEntryData(entries[currentMonth][index]);
    setCurrentView("entryForm");
  };

  const handleDeleteEntry = (index: number) => {
    const newEntries = { ...entries };
    newEntries[currentMonth].splice(index, 1);
    setEntries(newEntries);
    saveEntriesToLocalStorage(newEntries, currentUser!);
  };

  const calculateTotals = (month: string) => {
    const totalHoursWorked =
      entries[month]
        ?.reduce((total, entry) => total + parseFloat(entry.hoursWorked), 0)
        .toFixed(2) || "0.00";
    const totalWageEarned =
      entries[month]
        ?.reduce((total, entry) => total + parseFloat(entry.dailyWage), 0)
        .toFixed(2) || "0.00";
    return { totalHoursWorked, totalWageEarned };
  };

  const handleLogin = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem("currentUser", email);
    setCurrentView("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setCurrentView("login");
  };

  const handlePunchIn = () => {
    const wage = prompt("Enter your hourly wage");
    if (wage) {
      setPunchInWage(parseFloat(wage));
      setStartTime(new Date());
      setIsWorking(true);
      setIsPaused(false);
      setTotalPausedMinutes(0);
    } else {
      alert("Hourly wage is required to punch in.");
    }
  };

  const handlePause = () => {
    if (isPaused) {
      const now = new Date();
      if (pauseTime) {
        setTotalPausedMinutes(
          (prev) => prev + (now.getTime() - pauseTime.getTime()) / 60000
        );
      }
      setPauseTime(null);
    } else {
      setPauseTime(new Date());
    }
    setIsPaused(!isPaused);
  };

  const handlePunchOut = () => {
    const endTime = new Date();
    if (startTime) {
      const totalMinutesWorked =
        (endTime.getTime() - startTime.getTime()) / 60000 - totalPausedMinutes;
      const hoursWorked = totalMinutesWorked / 60;
      const dailyWage = (totalMinutesWorked * (punchInWage / 60)).toFixed(2);

      const entry: Entry = {
        date: startTime.toISOString().split("T")[0],
        startHour: startTime.toTimeString().split(" ")[0],
        endHour: endTime.toTimeString().split(" ")[0],
        breakTime: totalPausedMinutes,
        wage: punchInWage,
        isPublicHoliday: false,
        nightShiftIncrease: 0,
        nightShiftStart: "",
        nightShiftEnd: "",
        hoursWorked: hoursWorked.toFixed(2),
        dailyWage: dailyWage,
      };
      handleAddEntry(entry);
    }
    setIsWorking(false);
    setIsPaused(false);
    setStartTime(null);
    setPauseTime(null);
    setTotalPausedMinutes(0);
  };

  return (
    <div className={`${appStyles.main}`} style={{ backgroundColor }}>
      <DigitalClock />
      <div className="mx-auto mt-4 d-grid col-2 ">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
        
      </div>
      <div className="text-center d-flex row justify-content-center">
        <h1 className="text-white">Monthly Work Hours Tracker</h1>

        {!currentUser ? (
          <div className="m-5 row justify-content-md-center ">
            {currentView === "login" ? (
              <LoginForm
                onLogin={handleLogin}
                onSwitchToSignUp={() => setCurrentView("signUp")}
              />
            ) : (
              <SignUpForm onSwitchToLogin={() => setCurrentView("login")} />
            )}
          </div>
        ) : (
          <>
            {currentView === "home" && (
              <div className="">
                <div
                  id="month-cards"
                  className={`row ${appStyles.monthCardsContainer}`}
                >
                  {months.map((month) => {
                    const { totalHoursWorked, totalWageEarned } =
                      calculateTotals(month);
                    return (
                      <div className=" row justify-content-center col-12 col-sm-4 col-lg-3" key={month}>
                        <MonthCard
                          month={month}
                          totalHoursWorked={totalHoursWorked}
                          totalWageEarned={totalWageEarned}
                          onClick={handleMonthClick}
                        />
                      </div>
                    );
                  })}
                </div>{" "}
              </div>
            )}
            <div className="mt-3 d-grid gap-2 col-6 mx-auto ">
              {!isWorking ? (
                <button className="btn btn-success m-5" onClick={handlePunchIn}>
                  Punch In
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-warning mr-2 mt-2"
                    onClick={handlePause}
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={handlePunchOut}
                  >
                    Punch Out
                  </button>
                </>
              )}
            </div>
            {currentView === "entryForm" && (
              <EntryForm
                month={currentMonth}
                year={currentYear}
                onAddEntry={handleAddEntry}
                onBack={() => setCurrentView("monthEntries")}
                initialData={initialEntryData}
              />
            )}
            {currentView === "monthEntries" && (
              <div>
                <MonthEntries
                  month={currentMonth}
                  entries={entries[currentMonth]}
                  onBack={() => setCurrentView("home")}
                  onEditEntry={handleEditEntry}
                  onDeleteEntry={handleDeleteEntry}
                />
                <div className="text-center">
                  <button
                    className="btn btn-outline-warning d-grid gap-2 col-6 mx-auto"
                    onClick={() => setCurrentView("entryForm")}
                  >
                    Add New Entry
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
