'use client';

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { ArrowLeft, ArrowRight, ChevronLeft, Smile, Music, Search } from "lucide-react";
import IconPicker from "@/components/icon-picker";
import SpotifySearch from "@/components/spotify";
import SongItem from "@/components/songItem";
import Activities from "@/components/activities";

const parseDateParam = (dateParam: string | undefined) => {
    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        return null;
    }

    const [year, month, day] = dateParam.split("-").map(Number);
    const parsedDate = new Date(year, month - 1, day);

    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
    ) {
        return null;
    }

    return parsedDate;
};

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const DatePage = () => {
    const params = useParams();
    const dateParam = typeof params.date === "string" ? params.date : Array.isArray(params.date) ? params.date[0] : undefined;
    const parsedDate = parseDateParam(dateParam);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isFutureDate = parsedDate ? parsedDate > today : false;
    const isValidDate = Boolean(parsedDate) && !isFutureDate;
    const previousDate = parsedDate ? new Date(parsedDate) : null;
    const nextDate = parsedDate ? new Date(parsedDate) : null;

    const router = useRouter();

    if (previousDate) {
        previousDate.setDate(previousDate.getDate() - 1);
    }

    if (nextDate) {
        nextDate.setDate(nextDate.getDate() + 1);
    }

    const isPreviousDisabled = !previousDate || previousDate.getFullYear() < 2026;
    const isNextDisabled = !nextDate || nextDate > today;
    const [note, setNote] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handlePrevious = () => {
        if (previousDate && !isPreviousDisabled) {
            router.push(`/${formatDate(previousDate)}`);
        }
    };

    const handleNext = () => {
        if (nextDate && !isNextDisabled) {
            router.push(`/${formatDate(nextDate)}`);
        }
    };

    useEffect(() => {
        if (!isValidDate) {
            router.replace("/");
        }
    }, [isValidDate, router]);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [note]);

    if (!isValidDate) {
        return null;
    }

    const mood = useQuery(api.dates.getMoodByDate, {
        year: parseInt(dateParam!.split("-")[0]),
        month: parseInt(dateParam!.split("-")[1]),
        day: parseInt(dateParam!.split("-")[2]),
    });

    const registerMood = useMutation(api.dates.registerMood);
    const upsertNote = useMutation(api.dates.upsertNote);

    const onMoodSelect = (mood: string)=>{
        registerMood({
            year: parseInt(dateParam!.split("-")[0]),
            month: parseInt(dateParam!.split("-")[1]),
            day: parseInt(dateParam!.split("-")[2]),
            mood
        })
    }

    useEffect(() => {
        if (mood === undefined) {
            return;
        }

        setNote(mood?.note ?? "");
    }, [dateParam, mood?.note, mood]);

    useEffect(() => {
        if (mood === undefined || !dateParam) {
            return;
        }

        if (note === (mood?.note ?? "")) {
            return;
        }

        const timeout = setTimeout(() => {
            upsertNote({
                date: dateParam,
                note,
            });
        }, 350);

        return () => clearTimeout(timeout);
    }, [dateParam, mood, note, upsertNote]);

    if(mood === undefined ) {
        return (
            <main className="min-h-screen h-full flex flex-col w-full max-w-150 items-center">
                <div className="w-full flex justify-center p-4 mb-4">
                    <ChevronLeft onClick={()=> {router.push("/")}} className="size-8 cursor-pointer absolute left-4" />

                    <div className="flex items-center space-x-2">
                        <ArrowLeft className="size-6 cursor-pointer text-white bg-neutral-700 rounded-full p-1"/>
                        <h3 className="text-lg font-semibold bg-[#97d5a5] dark:bg-[#d497c6dd] px-2">{dateParam}</h3>
                        <ArrowRight className="size-6 cursor-pointer text-white bg-neutral-700 rounded-full p-1"/>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen h-full flex flex-col w-full max-w-150 items-center">
            <div className="w-full flex justify-center p-4 mb-4">
                <ChevronLeft onClick={()=> {router.push("/")}} className="size-8 cursor-pointer absolute left-4" />

                <div className="flex items-center space-x-2">
                    <ArrowLeft
                        onClick={handlePrevious}
                        className={`size-6 rounded-full p-1 text-white bg-neutral-700 ${isPreviousDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                    />
                    <h3 className="text-lg font-semibold bg-[#97d5a5] dark:bg-[#d497c6dd] px-2">{dateParam}</h3>
                    <ArrowRight
                        onClick={handleNext}
                        className={`size-6 rounded-full p-1 text-white bg-neutral-700 ${isNextDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                    />
                </div>
            </div>


            <div className="w-full flex px-4">
                <div className="w-full border border-neutral-700 p-4">
                    <IconPicker onChange={(mood: string) => onMoodSelect(mood)} asChild>
                        {mood?.mood ? (
                            <p className="text-[60px] text-center">{mood.mood}</p>
                        ) : (
                            <div className="flex justify-center">
                                <Smile className="size-15 text-neutral-400 cursor-pointer"/>
                            </div>                          
                        )}
                    </IconPicker>

                    <textarea
                        ref={textareaRef}
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={1}
                        className="font-azhu text-lg w-full p-3 text-center focus:outline-none min-h-5 max-h-[70vh] resize-none overflow-hidden"
                        placeholder="How was your day?"
                    />

                    <div className="w-full border border-neutral-700 mb-4"></div>

                    <div className="mb-4 flex flex-col h-fit">
                        {!mood?.song ? ( 
                            <>
                                <p className="text-sm mb-2"><Search className="inline-block mr-2 size-4" />Search song</p>
                                <div className="flex flex-col w-full justify-center">
                                    <SpotifySearch date={params.date as string}/>
                                </div>
                            </>
                        ): (
                            <>
                                <p className="text-sm mb-2"><Music className="inline-block mr-2 size-4" />Song of the day</p>
                                <SongItem name={mood.song.name} artist={mood.song.artist} cover={mood.song.coverUrl} durationMs={mood.song.durationMs} remove={true}/>
                            </>
                        )}

                        <p className="text-sm mb-2 mt-4"><Search className="inline-block mr-2 size-4" />Activities</p>
                        <Activities/>
                    </div>
                </div>
            </div>
        </main>
    );
}
 
export default DatePage;