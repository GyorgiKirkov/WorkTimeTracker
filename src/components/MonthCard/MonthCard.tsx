import React from 'react';
import cardStyles from "./MonthCard.module.css";

interface MonthCardProps {
    month: string;
    totalHoursWorked: string;
    totalWageEarned: string;
    onClick: (month: string) => void;
}

const MonthCard: React.FC<MonthCardProps> = ({ month, totalHoursWorked, totalWageEarned, onClick }) => {
    return (
        <div className="col-md-2 mb-4" onClick={() => onClick(month)}>
            <div className={`card ${cardStyles.cardbox}`}>
                <div className="card-body text-center">
                    <h5 className="card-title">{month.charAt(0).toUpperCase() + month.slice(1)}</h5>
                    <p>{totalHoursWorked}h</p>
                    <p> {totalWageEarned}€</p>
                </div>
            </div>
        </div>
    );
};

export default MonthCard;
