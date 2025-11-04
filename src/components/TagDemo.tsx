import { Tag } from "@/components/tag"
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    MinusCircle,
    RefreshCw,
} from "lucide-react"

export default function TagDemo() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Without icon</h3>
                <div className="flex flex-wrap gap-2">
                    <Tag color="success">success</Tag>
                    <Tag color="processing">processing</Tag>
                    <Tag color="error">error</Tag>
                    <Tag color="warning">warning</Tag>
                    <Tag color="default">default</Tag>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">With icon</h3>
                <div className="flex flex-wrap gap-2">
                    <Tag icon={<CheckCircle className="w-3.5 h-3.5" />} color="success">
                        success
                    </Tag>
                    <Tag icon={<RefreshCw className="w-3.5 h-3.5 animate-spin" />} color="processing">
                        processing
                    </Tag>
                    <Tag icon={<XCircle className="w-3.5 h-3.5" />} color="error">
                        error
                    </Tag>
                    <Tag icon={<AlertTriangle className="w-3.5 h-3.5" />} color="warning">
                        warning
                    </Tag>
                    <Tag icon={<Clock className="w-3.5 h-3.5" />} color="default">
                        waiting
                    </Tag>
                    <Tag icon={<MinusCircle className="w-3.5 h-3.5" />} color="default">
                        stop
                    </Tag>
                </div>
            </div>
        </div>
    )
}
