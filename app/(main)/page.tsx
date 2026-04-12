import Header from "./_components/header"
import GridDays from "./_components/grid"
import { PlusCircle } from "lucide-react";

const HomePage = () => {
    return (
        <main className="min-h-screen h-full flex flex-col justify-between">
            <div className="flex flex-col">
                <Header/>
                <GridDays/>
            </div>

            <div className="flex justify-center mb-6">
                <PlusCircle className="size-12"/>
            </div>
        </main>
    );
}
 
export default HomePage;