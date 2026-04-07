interface Props {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination = ({ currentPage, lastPage, onPageChange, isLoading }: Props) => (
  <div className="flex items-center justify-between border-t border-gray-100 pt-8 mt-12">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || isLoading}
      className="px-6 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 font-bold"
    >
      Previous
    </button>
    
    <div className="text-sm font-medium text-gray-500">
      Page <span className="text-black font-bold">{currentPage}</span> of {lastPage || 1}
    </div>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === lastPage || isLoading}
      className="px-6 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-40 font-bold"
    >
      Next
    </button>
  </div>
);