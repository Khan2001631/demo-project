import React, { useEffect, useState } from 'react';

const DateTimeComponent: React.FC = () => {
    const [dateTime, setDateTime] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            const currentDate = new Date();
            const month = currentDate.toLocaleString('default', { month: 'short' });
            const day = currentDate.getDate();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const formattedDateTime = `${month}. ${day} | ${hours}:${minutes.toString().padStart(2, '0')}`;
            setDateTime(formattedDateTime);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <div>{dateTime}</div>;
};

export default DateTimeComponent;