'use client';

import getDaysInMonth from '@/utils/getDays'
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type Date = {
    month: number;
    year: number;
    day?: number;
}

const GridDays = ({date}: {date: Date}) => {
    const router = useRouter();
    const moods = useQuery(api.dates.getMoodsByMonth, {
        year: date.year,
        month: date.month,
    })

    const totalDays = getDaysInMonth(date.year, date.month + 1);

    const now = new Date();
    const isCurrentMonth = date.year === now.getFullYear() && date.month === now.getMonth();

    const visibleDays = isCurrentMonth ? now.getDate() : totalDays

    const daysArray = Array.from({ length: visibleDays }, (_, i) => i + 1)

    const { isLoaded, isSignedIn, user } = useUser();
    
    if(!moods || !isLoaded || !isSignedIn || !user){
        return(
            <div className="px-4 grid grid-cols-5 justify-items-center gap-2">
                {daysArray.map((day) => (
                    <div 
                        key={`${date.month}-${date.year}-${day}`}
                        className="relative size-17 flex justify-center items-center bg-center bg-contain bg-no-repeat bordesvg animate-pulse"
                    >
                        {isCurrentMonth && day === now.getDate() ? (
                            <span className="text-neutral-400 font-bold -ml-1 font-caveat text-lg">Today</span>
                        ):(
                            <span className="text-neutral-400 font-bold -ml-1 font-caveat text-lg transition-colors duration-300 hover:text-xl">{day}</span>
                        )}
                    </div> 
                ))}
            </div>
        )
    }

    const moodsMap = Object.fromEntries(
        moods.map(m => [m.date, m.mood])
    );

    return (
        <div key={`grid-${date.month}-${date.year}`} className="px-4 grid grid-cols-5 justify-items-center gap-2 mb-8">
            {daysArray.map((day, index) => {
                const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const mood = moodsMap[formattedDate];

                return (
                    <div 
                        key={`${date.month}-${date.year}-${day}`}
                        className="group relative size-17 flex justify-center items-center bg-center bg-contain bg-no-repeat bordesvg transition-all duration-500 hover:scale-110 animate-fadeInUp cursor-pointer"
                        style={{
                            animationDelay: `${index * 0.01}s`
                        }}
                        onClick={()=> router.push(`/${formattedDate}`)}
                    >
                        {mood ? (
                            <span className="text-3xl cursor-pointer">{mood}</span>
                        ) : (
                            <>
                                {isCurrentMonth && day === now.getDate() ? (
                                    <span className="cursor-pointer text-neutral-400 font-bold -ml-1 font-caveat text-lg transition-opacity duration-200 group-hover:opacity-0">Today</span>
                                ):(
                                    <span className="cursor-pointer text-neutral-400 font-bold -ml-1 font-caveat text-lg transition-all duration-200 group-hover:opacity-0">{day}</span>
                                )}
                            </>
                        )}
                    </div> 
                );
            })}
        </div>
    );
}
 
export default GridDays;