import getDaysInMonth from '@/utils/getDays'

type Date = {
    month: number;
    year: number;
}

const GridDays = ({date}: {date: Date}) => {
    const totalDays = getDaysInMonth(date.year, date.month + 1);

    const now = new Date();
    const isCurrentMonth = date.year === now.getFullYear() && date.month === now.getMonth();

    const visibleDays = isCurrentMonth ? now.getDate() : totalDays

    const daysArray = Array.from({ length: visibleDays }, (_, i) => i + 1)

    const handleSelectMood = ()=>{
        console.log(date.year, date.month)
    }

    return (
        <div key={`grid-${date.month}-${date.year}`} className="px-4 grid grid-cols-5 justify-items-center gap-2">
            {daysArray.map((day, index) => (
                <div 
                    key={`${date.month}-${date.year}-${day}`}
                    className="relative size-17 flex justify-center items-center bg-center bg-contain bg-no-repeat bordesvg transition-all duration-500 hover:scale-110 hover:shadow-lg animate-fadeInUp"
                    onClick={()=> handleSelectMood} 
                    style={{
                        animationDelay: `${index * 0.01}s`
                    }}
                >
                    {isCurrentMonth && day === now.getDate() ? (
                        <span className="text-neutral-400 font-bold -ml-1 font-caveat text-lg">Today</span>
                    ):(
                        <span className="text-neutral-400 font-bold -ml-1 font-caveat text-lg transition-colors duration-300 hover:text-neutral-200">{day}</span>
                    )}
                </div> 
            ))}
        </div>
    );
}
 
export default GridDays;