"use client"

import EmojiPicker, { Theme } from "emoji-picker-react"
import { useTheme } from "next-themes";
import { useState } from "react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

interface IconPickerProps {
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean; 
}

const IconPicker = ({
    onChange,
    children,
    asChild
}: IconPickerProps) => {
    const [open, setOpen] = useState(false);
    const { resolvedTheme } = useTheme();
    const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap

    const themeMap = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT
    }

    const theme = themeMap[currentTheme]

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full border-none shadow-none">
                <EmojiPicker
                    height={350}
                    theme={theme}
                    searchDisabled
                    autoFocusSearch={false}
                    onEmojiClick={(data)=> {
                        onChange(data.emoji);
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
 
export default IconPicker;