import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Sorting, DataType } from "../types/index";


function useTableState(initialData: DataType[], recordsPerPage = 25) {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
  
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
    const initialSearchQuery = searchParams.get("search") || "";
    const initialSortKey = searchParams.get("sortKey") || "";
    const initialSortDirection = searchParams.get("sortDirection") || "";
  
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [sortConfig, setSortConfig] = useState<Sorting | null>(
      initialSortDirection && initialSortKey
        ? { key: initialSortKey, direction: initialSortDirection }
        : null
    );
  
    useEffect(() => {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("page", currentPage.toString());
      if (searchQuery) newSearchParams.set("search", searchQuery);
      if (sortConfig?.key) newSearchParams.set("sortKey", sortConfig.key);
      if (sortConfig?.direction) newSearchParams.set("sortDirection", sortConfig.direction);
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }, [currentPage, searchQuery, sortConfig, navigate]);
  
    const totalPages = Math.ceil(initialData.length / recordsPerPage);
  
    return { currentPage, setCurrentPage, searchQuery, setSearchQuery, sortConfig, setSortConfig, totalPages };
  }

  export default useTableState;
  