import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                    {Array.from({ length: 6 }).map((_, colIndex) => (
                        <TableCell key={`skeleton-cell-${colIndex}`}>
                            <Skeleton className="h-4 w-full rounded-md" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}
