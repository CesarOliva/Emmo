import { Bolt } from "lucide-react"

type Date = {
    month: number;
    year: number;
}

const Header = ({date}: {date: Date}) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <header className="w-full flex items-center justify-between p-4 mb-4">
            <div className="w-1/3">
                <h2 className="text-md font-medium">EMMO App</h2>
            </div>
            <div className="w-1/3 flex flex-col items-center space-y-2">
                <h4 className="text-md">{date.year}</h4>
                {/* Hacer efecto brochazo */}
                <h3 className="text-lg font-semibold bg-[#97d5a5] dark:bg-[#d497c6dd] px-2">{monthNames[date.month]}</h3>
            </div>
            <div className="w-1/3 flex justify-end">
                <Bolt className="size-7"/>
            </div>
        </header>
    );
}
 
export default Header;