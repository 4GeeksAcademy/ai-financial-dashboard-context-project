# Referencia funcional del dashboard

Este documento describe el comportamiento esperado y el contrato actual del backend. Las rutas son relativas a la base configurada por `VITE_API_BASE_URL`; en desarrollo, el frontend usa el proxy de `/api`.

## Contratos compartidos

- `DateRangeFilter` (`params-types.ts`): `start_date` y `end_date` opcionales, formato `YYYY-MM-DD`, inclusivos. Al omitirlos no se aplica ese limite.
- `FacetsResponse` (`api-types.ts`): `operation_types` (`income`/`outcome`), `business_types` (`B2B`/`B2C`), `categories` (`suppliers`, `sales`, `operational`, `administrative`, `others`), `min_date` y `max_date`.
- `FinancialMovement` (`src/lib/financial-types.ts`): `{ create_date: string, amount: number, operation_type: OperationType, category: Category, business_type: BusinessType }`.
- Las solicitudes se realizan al cambiar un valor valido; no hay boton Aplicar. En una recarga se muestra carga en la seccion afectada y no se presentan datos anteriores como si correspondieran a los filtros nuevos. Si falla la solicitud, esa seccion muestra error.

## 1. Filtro de rango de fechas

### API

- `GET /api/metrics/facets`: sin query params; devuelve `FacetsResponse` y el rango global disponible.
- `GET /api/metrics?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`: devuelve `FinancialMovement[]`; ambos query params son opcionales. Tambien admite `category` y `operation_type`.

### UI

- Mostrar campos opcionales de inicio y fin, junto a `min_date` y `max_date` de facetas. Las fechas seleccionadas se comparten con alertas y comparativa.
- Con ambas fechas vacias, omitir ambos parametros y mostrar el dataset completo. Con una vacia, filtrar desde esa fecha o hasta ella, inclusive.
- Rechazar fechas anteriores a `min_date`, posteriores a `max_date` o un inicio posterior al fin: mostrar validacion y no enviar la consulta.
- Mientras cargan facetas, mostrar carga. Si fallan, informar que el rango disponible no se pudo cargar y no inventar fechas.

## 2. Tabla de alertas de anomalias

### API

- PM propone `GET /api/metrics/alerts/status`; la ruta real es `GET /api/metrics/alerts`.
- Respuesta `AlertsResponse` (`AlertEntry[]`): cada elemento contiene `period: string`, `outcome_total: number`, `baseline_average: number` e `increase_ratio: number`. El ratio `0.3` representa 30%.
- Query params: `threshold` (numero, predeterminado `0.3`, backend exige `>= 0`), `group_by` (`day`/`week`/`month`, predeterminado `month`), fechas opcionales y `business_type` (`B2B`/`B2C`, opcional). Para esta tabla se omite `business_type` y se envia `group_by=month`.

### UI y semantica requerida

- El input numerico acepta decimales entre `0.1` y `1.0`, inclusive; inicia en `0.3`. Un valor vacio o invalido muestra validacion y no consulta. Al cambiar a un valor valido, consulta de inmediato.
- La tabla conserva sus cuatro columnas: periodo, gasto registrado, media de referencia e incremento porcentual. Mostrar `increase_ratio * 100` con un decimal.
- El requisito del PM define `baseline_average` como la media de los tres periodos inmediatamente anteriores. Si el rango visible empieza despues de esos periodos, estos se usan para calcular la referencia, pero solo se muestran alertas dentro del rango seleccionado.
- Sin tres periodos previos o con una media de referencia igual a cero, no se calcula un incremento ni se genera alerta para ese periodo.
- **Bloqueo de contrato:** el backend actual promedia todos los periodos previos que recibe y filtra movimientos por rango antes de resumirlos. Su respuesta no permite a la UI reconstruir la media movil de tres periodos. El endpoint debe alinearse a la semantica anterior antes de considerar cumplido ese requisito; la UI no sustituye esa media por una distinta.
- Respuesta `[]`: mantener tabla y mostrar «No se detectaron anomalias para este umbral y periodo». Carga y error reemplazan el cuerpo por sus estados respectivos.

## 3. Comparativa B2B vs B2C

### API

- PM propone `GET /api/metrics/categories?instantiation_type=income&limit=5`; ruta real: `GET /api/metrics/categories/top`.
- Consultar una vez por grupo, con `business_type=B2B` y `business_type=B2C`, ademas de `operation_type`, `limit` y las fechas activas.
- `operation_type`: `income` o `outcome` (el backend predetermina `outcome`; la UI envia la seleccion). `limit`: entero de 1 a 20 (predeterminado `5`). `business_type`: `B2B` o `B2C`. Fechas opcionales `YYYY-MM-DD`.
- La respuesta es `TopCategoryItemResponse[]`: `{ category: Category, operation_type: OperationType, total_amount: number }`. No incluye porcentaje ni total del grupo.
- `GET /api/metrics/facets` no tiene query params; categorias, tipos de operacion y negocios son globales, no por grupo. No existe query `category` ni `instantiation_type`.

### UI y calculos

- Mostrar secciones B2B y B2C en paralelo. El selector de metrica usa `FacetsResponse.operation_types`, inicia en `income` y actualiza ambas tablas y el grafico.
- El selector de categoria es multiseleccion, inicia en «todas» y filtra solo las filas de las tablas; el grafico sigue comparando el total del tipo de operacion elegido para cada grupo.
- Solicitar `limit=20` para reunir los totales de las categorias disponibles (la union actual `Category` tiene cinco valores). Calcular el total de cada grupo sumando `total_amount` de todas las categorias devueltas; mostrar como maximo las cinco categorias de mayor importe, o las seleccionadas, ordenadas por importe.
- Porcentaje de cada fila: `total_amount / totalGrupo * 100`, donde `totalGrupo` incluye todas las categorias del grupo para el tipo de operacion elegido, aunque el selector de categoria oculte filas. Mostrar con un decimal. El grafico compara esos dos totales. Importes en USD sin decimales.
- Un grupo sin resultados: mantener ambas secciones, mostrar «Sin datos para los filtros seleccionados» en la tabla vacia y representar su total como cero. Si `totalGrupo` es cero, mostrar `—` en los porcentajes para evitar division por cero.
- Si la categoria seleccionada no tiene filas en un grupo, mostrar el estado vacio solo en esa tabla; el total comparativo del grafico y el denominador del porcentaje siguen incluyendo todas las categorias del grupo.
- Carga, error o facetas vacias: mantener la estructura; indicar carga/error y, si no hay categorias disponibles, mostrar el mensaje de tabla vacia.
