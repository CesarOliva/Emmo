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

    return (
        <div className="px-8 grid grid-cols-5 justify-items-center gap-4">
            {daysArray.map((day) => (
                <div key={day} className="relative size-12 flex justify-center items-center bg-center bg-contain bg-no-repeat bordesvg">
                    <span className="text-neutral-400 font-bold -ml-1 font-caveat">{day}</span>
                </div> 
            ))}
        </div>
    );
}
 
export default GridDays;