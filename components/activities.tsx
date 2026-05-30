import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const Activities = () => {
    const [isAdding, setIsAdding] = useState(false)
    const [activity, setActivity] = useState('')
    const [color, setColor] = useState('#a7a9de')
    const params = useParams()
    
    const getOrCreateActivity = useMutation(api.dates.getOrCreateActivity)

    const getActivities = useQuery(api.dates.getActivities, {
        date: params.date as string
    })

    const handleCreate = (e: any)=>{
        e.preventDefault();

        if(activity.trim() === ''){
            setIsAdding(false);
            return;
        }

        getOrCreateActivity({
            date: params.date as string,
            name: activity,
            color: color
        })

        setActivity('')
        setColor('#a7a9de')
        setIsAdding(false)
    }

    return (
        <div className="py-2">
            <div className="flex w-full mb-1">
                {!isAdding ? (
                    <span 
                        onClick={()=>{setIsAdding(true)}}
                        className="m-1 flex text-sm items-center cursor-pointer">
                        <Plus className="w-5 h-5"/> Add Activities
                    </span>
                ):(
                    <form onSubmit={handleCreate} className="flex items-center gap-x-1 w-full">
                        <input
                            type="text" 
                            placeholder="Activities"
                            className="border border-neutral-700 rounded-xl p-2 focus:outline-none w-full"
                            value={activity}
                            onChange={e => setActivity(e.target.value)}
                        />
                        <input
                            type="color"
                            className="w-12 h-8"
                            value={color}
                            onChange={e => setColor(e.target.value)}                            
                        />

                        {isAdding && activity.trim() !== '' ? 
                            <button
                                type="submit" 
                                className="m-1 flex text-sm items-center cursor-pointer">
                                Add <Plus className="w-5 h-5"/>
                            </button>
                        :
                            <X onClick={()=>{setIsAdding(false)}} className="w-5 h-5 text-black dark:text-white cursor-pointer"/>
                        } 
                    </form>
                )}
            </div>

            <div className="flex flex-wrap">
                {getActivities?.map((act: any, index) => (
                    <div 
                        key={index}
                        style={{backgroundColor: act.color}}
                        className="m-1 inline-block rounded-md py-1 px-2 text-sm"
                    >
                        {act.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default Activities;