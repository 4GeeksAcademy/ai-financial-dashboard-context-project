import type {
  BusinessType,
  Category,
  OperationType,
} from '../src/lib/financial-types'

export interface FacetsResponse {
  /** Operaciones disponibles (`income`/`outcome`). */
  operation_types: OperationType[]
  /** Tipos de negocio disponibles (`B2B`/`B2C`). */
  business_types: BusinessType[]
  /** Categorias disponibles. */
  categories: Category[]
  /** Fecha mas antigua (`YYYY-MM-DD`). */
  min_date: string
  /** Fecha mas reciente (`YYYY-MM-DD`). */
  max_date: string
}

export interface AlertEntry {
  /** Periodo agrupado. */
  period: string
  /** Gasto total del periodo. */
  outcome_total: number
  /** Media de los periodos anteriores. */
  baseline_average: number
  /** Aumento relativo; `0.3` equivale a 30%. */
  increase_ratio: number
}

/** Array vacio si no hay alertas. */
export type AlertsResponse = AlertEntry[]

export interface TopCategoryItemResponse {
  /** Categoria. */
  category: Category
  /** Operacion (`income`/`outcome`). */
  operation_type: OperationType
  /** Importe total. */
  total_amount: number
}
