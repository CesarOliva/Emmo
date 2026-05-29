'use client';

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ChevronRight, X } from "lucide-react";
import { useParams } from "next/navigation";

const SongItem = ({
    name, artist, cover, durationMs, remove
}: {
    name: string,
    artist: string,
    cover: string,
    durationMs: number,
    remove: boolean
}) => {
    const params = useParams()
    const removeSong = useMutation(api.dates.removeSong)
    
    const formatDuration = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const onRemoveSong = ()=>{
        removeSong({
            date: params.date as string
        });
    }

    return (
        <div className="cursor-pointer flex justify-between items-center hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md p-1">
            <div className="flex justify-center items-center">
                <img className="w-12 h-12 rounded-md border-neutral-700 border" src={cover} alt={name}/>
                <div className="flex flex-col justify-center text-sm ml-2">
                    <h3 className="font-semibold">{name}</h3>
                    <h3 className="text-xs text-neutral-500">{artist} <span>• {formatDuration(durationMs)}</span></h3>
                </div>
            </div>
            {!remove ? 
                <ChevronRight className="w-6 h-6"/>
            :
                <X onClick={onRemoveSong} className="h-4 w-4 mr-1 text-black dark:text-white cursor-pointer"/>
            } 

        </div>
    );
}
 
export default SongItem;