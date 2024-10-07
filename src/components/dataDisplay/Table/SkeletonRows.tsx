import { Skeleton, TableCell, TableRow } from "@mui/material";

export default function SkeletonRows({rowRepeat = 1, colRepeat = 1} : {rowRepeat?: number; colRepeat?: number}){
    return Array.from({ length: rowRepeat }).map((_, tri) => (
        <TableRow key={tri}>
          {Array.from({ length: colRepeat }).map((_, tci) => (
            <TableCell key={tci}>
                <Skeleton />
            </TableCell>
          ))}
        </TableRow>
      ))
}