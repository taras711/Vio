import { useState } from "react";
export function IdentificatedPeriod({time}: {time: number}) {

    const morning = time < 12;
    const afternoon = time >= 12 && time < 18;
    const evening = time >= 18;
    
    const [period, setPeriod] = useState(morning ? "morning" : afternoon ? "afternoon" : evening ? "evening" : "night");
    const per = "Good " + period;
    const handleTimeChange = () => {
        const newTime = new Date();
        const newMorning = newTime.getHours() < 12;
        const newAfternoon = newTime.getHours() >= 12 && newTime.getHours() < 18;
        const newEvening = newTime.getHours() >= 18;
        setPeriod(newMorning ? "morning" : newAfternoon ? "afternoon" : newEvening ? "evening" : "night");
    };
    
    
    return { period: per, handleTimeChange };
}