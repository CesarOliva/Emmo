const GridDays = () => {
    const day = new Date().getDay()
    const daysPassed: number [] = []

    for(let i=0; i<day;i++){
        daysPassed.push(i+1)
    }
    
    return (
        <div className="px-8 grid grid-cols-5 justify-items-center gap-4">
            {daysPassed.map((day) => (
                <div key={day} className="relative size-12 flex justify-center items-center bg-center bg-contain bg-no-repeat bordesvg">
                    <span className="text-neutral-400 font-bold -ml-1 font-caveat">{day}</span>
                </div> 
            ))}
        </div>
    );
}
 
export default GridDays;