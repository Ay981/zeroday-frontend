interface Props {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination = ({ currentPage, lastPage, onPageChange, isLoading }: Props) => (
  <div className="flex items-center justify-between border-t border-border pt-8 mt-12">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1 || isLoading}
      className="px-5 py-2 bg-card border border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed font-bold text-foreground hover:border-primary/50 transition-all duration-200 motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Previous
    </button>
    
    <div className="text-sm font-medium text-muted-foreground">
      Page <span className="text-foreground font-bold">{currentPage}</span> of {lastPage || 1}
    </div>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === lastPage || isLoading}
      className="px-5 py-2 bg-card border border-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed font-bold text-foreground hover:border-primary/50 transition-all duration-200 motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Next
    </button>
  </div>
);