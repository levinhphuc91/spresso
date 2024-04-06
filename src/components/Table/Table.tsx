import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ColumnType, DataType, Sorting } from "../../types/index";

type TableProps = {
  rawData: DataType[];
  config: ColumnType[];
  loading: boolean;
};

const Table: React.FC<TableProps> = ({ rawData, config, loading }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialSearchQuery = searchParams.get("search") || "";
  const initialSortKey = searchParams.get("sortKey") || "";
  const initialSortDirection = searchParams.get("sortDirection") || "";
  const initialSort =
    initialSortDirection && initialSortKey
      ? {
          key: initialSortKey,
          direction: initialSortDirection,
        }
      : null;

  const recordsPerPage = 25;
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortConfig, setSortConfig] = useState<Sorting | null>(initialSort);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    setData(rawData);
    setTotalPages(Math.ceil(rawData.length / recordsPerPage));
  }, [rawData]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
  
    newSearchParams.set('page', currentPage.toString());
    if (searchQuery) newSearchParams.set('search', searchQuery);
    if (sortConfig?.key) newSearchParams.set('sortKey', sortConfig.key);
    if (sortConfig?.direction) newSearchParams.set('sortDirection', sortConfig.direction);
  
    navigate({
      search: newSearchParams.toString(),
    });
  }, [currentPage, searchQuery, sortConfig, navigate]);

  useEffect(() => {
    if (!sortConfig) return;

    setData((currentData) =>
      [...currentData].sort((a, b) => {
        if (
          a[sortConfig.key as keyof DataType] <
          b[sortConfig.key as keyof DataType]
        )
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (
          a[sortConfig.key as keyof DataType] >
          b[sortConfig.key as keyof DataType]
        )
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      })
    );
  }, [sortConfig, rawData]);

  const toggleSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const onPrevious = () => {
    window.scrollTo(0, 0);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const onNext = () => {
    window.scrollTo(0, 0);
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowSelectionChange = (id: number) => {
    const newSelection = new Set(selectedRows);
    if (selectedRows.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const filteredData = data.filter(
    (item) =>
      item.userId.toString().includes(searchQuery) ||
      item.id.toString().includes(searchQuery) ||
      item.title.toLowerCase().includes(searchQuery) ||
      item.body.toLowerCase().includes(searchQuery)
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  const renderTableBody = () => {
    return paginatedData.map((row) => (
      <tr
        key={row.id}
        className="gap-x-4 px-4 py-3 hover:bg-gray-100 cursor-pointer"
      >
        {config.map((column) => (
          <td key={column.accessor}>
            {column.accessor === "checkbox" ? (
              <input
                type="checkbox"
                className="m-2"
                aria-label={`Select row ${row.id}`}
                checked={selectedRows.has(row.id)}
                onChange={() => handleRowSelectionChange(row.id)}
              />
            ) : (
              row[column.accessor as keyof DataType]
            )}
          </td>
        ))}
      </tr>
    ));
  };

  const renderPagination = () => {
    return (
      <div className="mt-4 flex justify-end items-center">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="p-2 rounded border-2"
        >
          Previous
        </button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="p-2 border-2 rounded"
        >
          Next
        </button>
      </div>
    );
  };

  const renderSelectedRow = () => {
    if (selectedRows.size === 0) return null;
    return (
      <div>
        <h3>Selected Rows:</h3>
        <pre>
          {JSON.stringify(
            data.filter((row) => selectedRows.has(row.id)),
            null,
            2
          )}
        </pre>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <tr className="flex justify-center">
        <td>
          <img
            className="h-16 w-16"
            src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
            alt="spinner"
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="mb-4 mt-2 p-2 border rounded"
        />
      </div>
      <table>
        <thead>
          <tr className="border-b border-gray-50 text-sm font-bold text-gray-400">
            {config.map((column) => (
              <th
                className={`text-left py-3 
                ${column.sortable ? "cursor-pointer" : "cursor-auto"}
                ${column.width ? `w-[${column.width}]` : "w-auto"}`}
                key={column.accessor}
                onClick={() => column.sortable && toggleSort(column.accessor)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{!loading ? renderTableBody() : renderLoading()}</tbody>
      </table>
      {renderPagination()}
      {renderSelectedRow()}
    </div>
  );
};

export default Table;
