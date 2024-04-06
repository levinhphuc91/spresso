import { ColumnType } from "../types/index";

const config: ColumnType[] = [
  { header: "", accessor: "checkbox", width: '5%' },
  { header: "User Id", accessor: "userId", sortable: true, width: '10%' },
  { header: "Id", accessor: "id", sortable: true, width: '10%' },
  { header: "Title", accessor: "title", width: '30%' },
  { header: "Content", accessor: "body", width: '45%' },
];

export default config;
