import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    onChange: (value: number) => void;
    value: number;
}

export default function Quantity({ onChange, value }: Props) {
    return (
        <div className="flex gap-1 ">
            <Button className="h-6 w-6 p-0 cursor-pointer" disabled={value === 0} onClick={() => onChange(value - 1)}>
                <Minus className="w-3 h-3" />
            </Button>
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-6 p-1 w-8"
                value={value}
                onChange={(e) => {
                    const value = e.target.value;
                    const numberValue = Number(value);
                    if (isNaN(numberValue)) {
                        return;
                    }
                    onChange(numberValue);
                }}
            />
            <Button className="h-6 w-6 p-0 cursor-pointer" onClick={() => onChange(value + 1)}>
                <Plus className="w-3 h-3" />
            </Button>
        </div>
    );
}
