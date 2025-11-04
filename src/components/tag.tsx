import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export type TagColor = "success" | "processing" | "error" | "warning" | "default"

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: TagColor
    icon?: React.ReactNode
    loading?: boolean
}

const colorMap: Record<TagColor, string> = {
    success:
        "text-green-500 border-green-400 bg-green-50",
    processing:
        "text-blue-500 border-blue-400 bg-blue-50",
    error:
        "text-red-500 border-red-400 bg-red-50",
    warning:
        "text-amber-500 border-amber-400 bg-amber-50",
    default:
        "text-gray-500 border-gray-400 bg-gray-50",
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
    ({ color = "default", icon, loading, className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-1 px-2 py-[2px] text-sm rounded-md border font-medium",
                    colorMap[color],
                    className
                )}
                {...props}
            >
                {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    icon && <span className="w-3.5 h-3.5">{icon}</span>
                )}
                <span>{children}</span>
            </div>
        )
    }
)
Tag.displayName = "Tag"
