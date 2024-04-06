export type DataType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type ColumnType = {
  header: string;
  accessor: string;
  sortable?: boolean;
  width?: string;
};

export type Sorting = { key: string; direction: string };
