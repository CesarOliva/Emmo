"use client";

import Header from "./_components/header"
import GridDays from "./_components/grid"
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const HomePage = () => {
    const [date, setDate] = useState({ 
        year: new Date().getFullYear(), 
        month: new Date().getMonth() 
    })

    const updateMonth = (direction: -1 | 1) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        setDate((prev) => {
            const nextMonth =
                direction === 1
                    ? prev.month === 11
                        ? 0
                        : prev.month + 1
                    : prev.month === 0
                        ? 11
                        : prev.month - 1;

            const nextYear =
                direction === 1
                    ? prev.month === 11
                        ? prev.year + 1
                        : prev.year
                    : prev.month === 0
                        ? prev.year - 1
                        : prev.year;

            // Validar fecha futura
            if (nextYear > currentYear) return prev;
            if (nextYear === currentYear && nextMonth > currentMonth) return prev;

            // Anio minimo 2026
            if (nextYear < 2026) return prev;

            return { year: nextYear, month: nextMonth };
        });
    }

    //Handle month change using wheel and touch events.
    useEffect(()=>{
        //Define sens
        const SCROLL_SENS = 80;
        const SWIPE_SENS = 50;

        //Initializes controls
        let wheelDelta = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        
        //For PCs
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            wheelDelta += e.deltaY;
            
            if(wheelDelta >= SCROLL_SENS){
                updateMonth(1);
                wheelDelta = 0;
            } 
            else if(wheelDelta <= -SCROLL_SENS){
                updateMonth(-1);
                wheelDelta = 0;
            }
        }

        //For mobiles
        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Horizontal movements.
            if (Math.abs(deltaX) < SWIPE_SENS || Math.abs(deltaX) <= Math.abs(deltaY)) {
                return;
            }

            // Right goes next, left goes prev.
            if (deltaX > 0) {
                updateMonth(-1);
            } else {
                updateMonth(1);
            }
        }
        
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return ()=> {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [])

    return (
        <main className="min-h-screen h-full flex flex-col justify-between">
            <div className="flex flex-col">
                <Header date={date}/>
                <GridDays date={date}/>
            </div>

            <div className="flex justify-center mb-6">
                <PlusCircle className="size-12"/>
            </div>
        </main>
    );
}
 
export default HomePage;