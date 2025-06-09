import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { getTableLink } from "@/lib/utils";

interface Props {
    token: string;
    tableNumber: number;
    width?: number;
}

export default function QrCodeTable({ tableNumber, token, width = 250 }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Hiện tại ý tưởng là cho thư viện tạo ra 1 canvas ảo,
        // xong rồi sẽ thêm canvas ảo đó vào Canvas thật của mình
        // Canvas thật bao gồm chữ và QR Code

        const canvas = canvasRef.current!;
        canvas.height = width + 70;
        canvas.width = width;

        const canvasContext = canvas.getContext("2d")!;
        canvasContext.fillStyle = "#fff";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.font = "20px Arial";
        // ĐĐiểm giữa dòng chữ là điểm bắt đầu của dòng chữ
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "#000";
        // canvas.width / 2 để bắT đầu từ giữa
        canvasContext.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, canvas.width + 20);
        canvasContext.fillText(`Quét mã Qr để gọi món`, canvas.width / 2, canvas.width + 50);

        const tableLink = getTableLink({ token, tableNumber });
        const virtualCanvas = document.createElement("canvas");
        QRCode.toCanvas(virtualCanvas, tableLink, function (error) {
            if (error) console.error(error);
            console.log("success!");
            canvasContext.drawImage(virtualCanvas, 0, 0, width, width);
        });
    }, []);
    return <canvas ref={canvasRef}></canvas>;
}

// getTableLink({ token: row.getValue("token"), tableNumber: row.getValue("number") });
