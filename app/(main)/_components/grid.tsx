import getDaysInMonth from '@/utils/getDays'
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import IconPicker from '@/components/icon-picker';
import { Smile } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

type Date = {
    month: number;
    year: number;
    day?: number;
}

const GridDays = ({date}: {date: Date}) => {
    const moods = useQuery(api.dates.getMoodsByMonth, {
        year: date.year,
        month: date.month,
    })

    const registerMood = useMutation(api.dates.registerMood);
    const onMoodSelect = (mood: string, date: Date)=>{
        registerMood({
            year: date.year,
            month: date.month+1,
            day: date.day!,
            mood
        })
    }

    const deleteMood = useMutation(api.dates.deleteMood);
    const handleRemove = (date: Date) => {
        deleteMood({
            year: date.year,
            month: date.month+1,
            day: date.day!,
        })
    }

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
                    >
                        {mood ? (
                            <span className="text-3xl cursor-pointer" onClick={()=> handleRemove({year: date.year, month: date.month, day})}>{mood}</span>
                        ) : (
                            <>
                                {isCurrentMonth && day === now.getDate() ? (
                                    <span className="cursor-pointer text-neutral-400 font-bold -ml-1 font-caveat text-lg transition-opacity duration-200 group-hover:opacity-0">Today</span>
                                ):(
                                    <span className="cursor-pointer text-neutral-400 font-bold -ml-1 font-caveat text-lg transition-all duration-200 group-hover:opacity-0">{day}</span>
                                )}
                                    <IconPicker onChange={(mood: string) => onMoodSelect(mood, {year: date.year, month: date.month, day})} asChild>
                                        <div className="cursor-pointer absolute inset-0 md:hidden items-center justify-center group-hover:md:flex w-full">
                                            <button className="rounded-full text-xs p-2 ">
                                                <Smile className="size-6 text-neutral-400 cursor-pointer opacity-0 md:opacity-100"/>
                                            </button>
                                        </div>
                                    </IconPicker>
                            </>
                        )}
                    </div> 
                );
            })}
        </div>
    );
}
 
export default GridDays;