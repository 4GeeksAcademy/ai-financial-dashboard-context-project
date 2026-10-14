import type {
  BusinessType,
  OperationType,
} from '../src/lib/financial-types'

export interface DateRangeFilter {
  /** Fecha inicial inclusiva (`YYYY-MM-DD`). */
  start_date?: string
  /** Fecha final inclusiva (`YYYY-MM-DD`). */
  end_date?: string
}

/** Agrupacion: `day`, `week` o `month`. */
export type GroupBy = 'day' | 'week' | 'month'

export interface AlertsParams extends DateRangeFilter {
  /** Umbral minimo (predeterminado `0.3`, minimo `0`). */
  threshold?: number
  /** Agrupacion (predeterminada `month`). */
  group_by?: GroupBy
  /** Tipo de negocio: `B2B` o `B2C`. */
  business_type?: BusinessType
}

export interface TopCategoryItemParams extends DateRangeFilter {
  /** Operacion (predeterminada `outcome`). */
  operation_type?: OperationType
  /** Limite (predeterminado `5`, rango `1`-`20`). */
  limit?: number
  /** Tipo de negocio: `B2B` o `B2C`. */
  business_type?: BusinessType
}
