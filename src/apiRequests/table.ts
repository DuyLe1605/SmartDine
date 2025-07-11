import http from "@/lib/http";
import {
    CreateTableBodyType,
    TableListResType,
    TableResType,
    UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

const prefix = "/tables";

const tableApiRequest = {
    list: () => http.get<TableListResType>(prefix),
    getTable: (number: number) => http.get<TableResType>(`${prefix}/${number}`),
    addTable: (body: CreateTableBodyType) => http.post<TableResType>(`${prefix}`, body),
    updateTable: (number: number, body: UpdateTableBodyType) => http.put<TableResType>(`${prefix}/${number}`, body),
    deleteTable: (number: number) => http.delete<TableResType>(`${prefix}/${number}`),
};

export default tableApiRequest;
