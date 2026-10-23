import { ChevronLeft } from '@primeicons/react/chevron-left'
import { ChevronRight } from '@primeicons/react/chevron-right'
import { Button } from '@primereact/ui/button'
import { SelectInput } from '../form/SelectInput'
import './TablePagination.scss'

type TablePaginationProps = {
  page: number
  pageSize: number
  total: number
  pageSizeOptions: readonly number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

/** Pager for server-side pagination: range summary, previous/next, and rows per page. */
export function TablePagination({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <nav className="table-pagination" aria-label="Paginación">
      <p className="table-pagination__summary" aria-live="polite">
        {total === 0
          ? 'Sin resultados'
          : `${first}–${last} de ${total.toLocaleString('es-HN')} registros`}
      </p>

      <div className="table-pagination__controls">
        <div className="table-pagination__page-size">
          <span aria-hidden="true">Filas</span>
          <SelectInput
            inputId="page-size"
            ariaLabel="Filas por página"
            options={pageSizeOptions.map((size) => ({ value: size, label: String(size) }))}
            value={pageSize}
            onChange={(size) => size && onPageSizeChange(size)}
          />
        </div>

        <Button
          variant="text"
          severity="secondary"
          iconOnly
          rounded
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <span className="table-pagination__page">
          Página {page} de {pageCount}
        </span>
        <Button
          variant="text"
          severity="secondary"
          iconOnly
          rounded
          aria-label="Página siguiente"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}
