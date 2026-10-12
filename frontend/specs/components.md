# Especificacion de componentes

Los props usan los tipos de Fase 2. La pagina contenedora conserva los filtros compartidos y coordina las solicitudes.

## Filtro de rango de fechas

**Componente:** `DateRangeFilter`

| Prop | Tipo | Uso |
|---|---|---|
| `value` | `DateRangeFilter` | Fechas seleccionadas; ambas vacias al iniciar. |
| `facets` | `FacetsResponse` | Mostrar `min_date` y `max_date` como rango disponible. |
| `onChange` | Recibe `DateRangeFilter` | Notificar cambios en inicio o fin. |
| `loading` | `boolean` | Indicar carga de facetas. |
| `error` | `string` opcional | Informar que no se pudo cargar el rango. |

Los dos campos son opcionales y usan `YYYY-MM-DD`. Los limites son inclusivos; una fecha vacia deja ese extremo sin limitar. Con ambas vacias se consultan todos los datos disponibles. Si el inicio supera al fin, se muestra un error y no se actualizan las consultas. Mientras cargan las facetas, los campos se deshabilitan; si fallan, se informa el error y se mantienen los campos habilitados sin presentar un rango valido.

El rango seleccionado se comparte con las alertas y la comparativa. Cada respuesta actualiza sus datos y estados de carga/error de forma independiente.

## Tabla de alertas de anomalias

**Componente:** `AnomalyAlertsTable`

| Prop | Tipo | Uso |
|---|---|---|
| `alerts` | `AlertsResponse` | Alertas recibidas; es un array y puede estar vacio. |
| `params` | `AlertsParams` | Umbral, agrupacion, negocio y rango de fechas activo. |
| `onParamsChange` | Recibe `AlertsParams` | Notificar cambios del umbral conservando los demas filtros. |
| `loading` | `boolean` | Mostrar estado de carga. |
| `error` | `string` opcional | Mostrar el error de consulta. |

El umbral es numerico, entre `0.1` y `1.0` inclusive, con valor inicial `0.3`. Valores vacios o fuera del rango muestran validacion y no generan una solicitud. La agrupacion inicial es mensual (`group_by: month`). El rango de fechas es el mismo del filtro compartido.

Las columnas son periodo (`period`), gasto registrado (`outcome_total`), promedio de referencia (`baseline_average`) e incremento porcentual (`increase_ratio` multiplicado por 100 para mostrarlo como porcentaje). Mientras carga se muestra un indicador; ante error, un mensaje de error; con `alerts` vacio, el mensaje explicito «No se detectaron anomalias para este umbral y periodo».

## Vista comparativa B2B vs B2C

**Componente:** `B2BvsB2CComparison`

| Prop | Tipo | Uso |
|---|---|---|
| `facets` | `FacetsResponse` | Opciones de negocio, categoria y tipo de operacion. |
| `dateRange` | `DateRangeFilter` | Rango compartido; vacio significa todos los datos. |
| `operationType` | `OperationType` | Metrica seleccionada; valor inicial `income`. |
| `selectedCategories` | `TopCategoryItemResponse["category"][]` | Categorias seleccionadas desde las facetas. Vacio significa todas. |
| `b2bItems` | `TopCategoryItemResponse[]` | Categorias ordenadas recibidas para B2B. |
| `b2cItems` | `TopCategoryItemResponse[]` | Categorias ordenadas recibidas para B2C. |
| `b2bTotal` | `number` | Total del tipo de operacion seleccionado para B2B. |
| `b2cTotal` | `number` | Total del tipo de operacion seleccionado para B2C. |
| `onOperationTypeChange` | Recibe `OperationType` | Actualizar la metrica seleccionada. |
| `onCategoriesChange` | Recibe `TopCategoryItemResponse["category"][]` | Actualizar categorias seleccionadas. |
| `loading` | `boolean` | Mostrar estado de carga. |
| `error` | `string` opcional | Mostrar el error de consulta. |

Las dos secciones de negocio aparecen en paralelo y cada tabla presenta hasta cinco categorias, con total y porcentaje del total de su grupo (`total_amount / b2bTotal` o `total_amount / b2cTotal`). El grafico comun compara esos totales. Las opciones de categoria y operacion provienen de `facets.categories` y `facets.operation_types`; las categorias no se consideran especificas de cada negocio. Si no hay resultados para un grupo, su tabla muestra «Sin datos para los filtros seleccionados» y el grafico representa su total como cero. Si el denominador es cero, el porcentaje se muestra como «—».

Mientras cargan datos se muestran indicadores de carga; ante error se muestra el mensaje correspondiente. Una respuesta vacia en un grupo no oculta la otra seccion.

## Diferencias del contrato actual

- El backend expone `GET /api/metrics/alerts`, no `/api/metrics/alerts/status`. `AlertEntry` contiene `period`, `outcome_total`, `baseline_average` e `increase_ratio`; `baseline_average` promedia periodos anteriores, no necesariamente solo los tres anteriores.
- El backend acepta `threshold >= 0`, con valor inicial `0.3`, pero no impone el intervalo `0.1–1.0` descrito para el control.
- El backend expone `GET /api/metrics/categories/top`, no `/api/metrics/categories`. Usa `operation_type`, `limit`, `start_date`, `end_date` y `business_type`; la respuesta `TopCategoryItemResponse` no incluye el porcentaje del grupo.
- `GET /api/metrics/facets` devuelve categorias y tipos globales, no facetas separadas por B2B y B2C. Los totales por grupo deben provenir de datos agregados por negocio; no forman parte de la respuesta de categorias top.
