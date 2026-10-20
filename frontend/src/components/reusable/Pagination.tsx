interface props {
  totalPages: number;
  ITEMS_PER_PAGE: number;
  currentPage: number;
  totalCount: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  label: string;
}

const Pagination = ({
  totalPages,
  ITEMS_PER_PAGE,
  currentPage,
  totalCount,
  setCurrentPage,
  label,
}: props) => {
  
  return (
    <div className="mt-6">
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mb-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-[10px] md:text-xs px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`text-[10px] md:text-xs  w-6 h-6 md:w-8 md:h-8 rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                  : 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-[10px] md:text-xs px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-[10px] md:text-xs text-zinc-500">
          Page {currentPage} of {totalPages}
        </p>
        <p className="text-[10px] md:text-xs text-zinc-500">
          {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
          {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}{' '}
          {label}
        </p>
      </div>

      
    </div>
  );
};

export default Pagination;
