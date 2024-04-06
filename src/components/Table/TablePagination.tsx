type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

const TablePagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: TablePaginationProps) => (
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

export default TablePagination;
