'use client';

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Search, X } from "lucide-react";
import { useState } from "react";
import SongItem from "./songItem";

type songSnapshot = {
    name: string;
    artist: string,
    coverUrl: string,
    durationMs: number;
}

const SpotifySearch = ({
    date,
}: {
    date: string
}) => {
    const [song, setSong] = useState('')
    const [songs, setSongs] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const update = useMutation(api.dates.addSong);

    function handleSearch(e: any){
        e.preventDefault();
        setIsSearching(true);

        if(song.trim() === ''){
            setIsSearching(false);
            return;
        }

        setSong('')
        getSong(song)
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ee7f029faemsh6826b0bcbf41470p1615d1jsn91d20ad48c9f',
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    async function getSong(cancion: string){
        try{
            const url = `https://spotify23.p.rapidapi.com/search/?q=${cancion}&type=tracks&offset=0&limit=5&numberOfTopResults=5`;
            const data = await fetch(url, options)
            const res = await data.json()
            console.log(res.tracks.items)
            setSongs(res.tracks.items)
        } catch(error){
            console.error('An error has occured.', error)
        }
    }

    const removeList = ()=>{
        setIsSearching(false);
    }

    const handleSelect = (song: songSnapshot)=>{
        update({
            date: date,
            song
        });
        removeList();
    }
    
    return (
        <>
            <form onSubmit={handleSearch} className="w-full">
                <div className="w-full border border-neutral-700 rounded-xl mb-2 p-2 flex items-center">
                    <input className="w-full bg-transparent border-none focus:outline-none" 
                        type="text"
                        value={song}
                        onChange={e => setSong(e.target.value)}
                        placeholder="Select daily song"
                    />
                    {!isSearching ? 
                        <button type="submit"><Search className="h-4 w-4 mr-1 text-black dark:text-white"/></button>
                    :
                        <X onClick={removeList} className="h-4 w-4 mr-1 text-black dark:text-white cursor-pointer"/>
                    } 

                </div>
            </form>

                
            {isSearching && (
                <>
                    {songs.map((song, index)=>(
                        <div 
                            className='p-1'
                            key={index}
                            onClick={() => handleSelect({
                                name: song.data.name,
                                artist: song.data.artists.items[0].profile.name,
                                coverUrl: song.data.albumOfTrack.coverArt.sources[0].url,
                                durationMs: song.data.duration.totalMilliseconds
                            })}
                        >
                            <SongItem name={song.data.name} artist={song.data.artists.items[0].profile.name} cover={song.data.albumOfTrack.coverArt.sources[0].url} durationMs={song.data.duration.totalMilliseconds} remove={false} />
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
 
export default SpotifySearch;