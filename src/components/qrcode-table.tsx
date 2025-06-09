import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { getTableLink } from "@/lib/utils";

interface Props {
    token: string;
    tableNumber: number;
    width?: number;
}

export default function QrCodeTable({ tableNumber, token, width }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const tableLink = getTableLink({ token, tableNumber });

        QRCode.toCanvas(canvas, tableLink, function (error) {
            if (error) console.error(error);
            console.log("success!");
        });
    }, []);
    return <canvas ref={canvasRef}></canvas>;
}

// getTableLink({ token: row.getValue("token"), tableNumber: row.getValue("number") });
