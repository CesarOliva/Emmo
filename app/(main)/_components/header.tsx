import { Bolt } from "lucide-react"

const Header = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <header className="w-full flex items-center justify-between p-4 mb-8">
            <div className="w-1/3">
                <h2 className="text-md font-medium">EMMO App</h2>
            </div>
            <div className="w-1/3 flex flex-col items-center space-y-2">
                <h4 className="text-xs">{year}</h4>
                {/* Hacer efecto brochazo */}
                <h3 className="text-md font-semibold bg-[#97d5a5] px-2">{monthNames[month]}</h3>
            </div>
            <div className="w-1/3 flex justify-end">
                <Bolt/>
            </div>
        </header>
    );
}
 
export default Header;