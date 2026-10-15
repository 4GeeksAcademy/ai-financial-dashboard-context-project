---
name: financial-discrepancy-investigator
description: >-
  Investiga discrepancias concretas en los KPI, totales, periodos o gráficos de
  este dashboard financiero. Actívala cuando el usuario informe que una cifra
  no coincide con los movimientos, un mes aparece mal agrupado o un gráfico
  contradice los datos. No la actives para preguntas generales de fórmulas,
  cambios exclusivamente visuales ni revisiones generales de accesibilidad o
  rendimiento.
metadata:
  version: "0.1.0"
---

# Investigador de discrepancias financieras

## Instrucciones

1. Confirma qué indicador, gráfico o periodo presenta la discrepancia y cuál es
   el resultado observado y el esperado. Si falta información indispensable,
   pide únicamente esos datos antes de concluir.
2. Lee las instrucciones aplicables del repositorio y limita la inspección al
   recorrido implicado. Para un KPI, sigue los movimientos desde el endpoint y
   sus modelos hasta `financial-types.ts`, `financial-utils.ts` y el componente
   que lo muestra.
3. Recalcula a partir de datos disponibles, no del valor visual cuestionado.
   Respeta las convenciones actuales: beneficio = ingresos - gastos; margen =
   beneficio / ingresos; margen cero si no hay ingresos; formato monetario USD
   sin decimales.
4. Si la discrepancia es temporal, inspecciona `create_date`, la interpretación
   como fecha de calendario, la zona horaria, la agrupación por año y mes, el
   orden cronológico y la inclusión de los extremos de los filtros.
5. Distingue registros con valor cero de ausencia de registros, carga y error.
   No infieras que un margen de 0 % significa que no hay datos.
6. Sustenta los cálculos con los campos y valores efectivamente disponibles.
   No inventes movimientos, respuestas de API ni resultados de pruebas.
7. Clasifica cada hallazgo como **verificado**, **hipótesis** o **pendiente de
   datos**. Vincula la conclusión con archivos, funciones o pruebas existentes.
8. Propón la comprobación mínima que discrimine entre las causas posibles. Si
   ejecutas una prueba, informa el comando y su resultado real; no afirmes que
   una evaluación pasó si no se ejecutó.
9. Mantén la tarea en modo de diagnóstico. No edites archivos ni cambies el
   contrato. Si el usuario también pide una corrección, confirma ese alcance y
   sigue entonces las reglas de frontend, backend o integración aplicables.

Entrega el informe con estas partes: discrepancia, recorrido inspeccionado,
recalculación, diagnóstico y siguiente comprobación recomendada.

## Ejemplos

**Usuario:** “La suma de ingresos de estos movimientos es 12.000 USD, pero el
KPI muestra 11.500 USD. ¿Dónde está la diferencia?”

**Comportamiento esperado:** rastrear cómo se obtiene el KPI, sumar los
movimientos de operación `income` proporcionados y comparar el subtotal con el
resultado mostrado. Informar los valores y la fórmula usados, citar el código
relevante y etiquetar la causa como verificada, hipótesis o pendiente de datos.
No editar archivos ni afirmar que se ejecutaron pruebas si no ocurrió.

## Configuración

### Activación y límites

- Activar ante una discrepancia reportada entre movimientos, KPI, periodo o
  gráfico.
- No activar ante una pregunta aislada sobre una fórmula si no se reporta un
  resultado incorrecto.
- No activar ante peticiones exclusivamente de diseño, accesibilidad o
  rendimiento.
- La skill complementa, pero no reemplaza, `.agents/rules/frontend.md` ni
  `.agents/rules/backend.md`. Consultar ambas cuando el recorrido cruce el
  contrato o las capas.
- Las skills de diseño, accesibilidad y rendimiento se aplican solo si la tarea
  también incluye explícitamente esos objetivos.

### Fuentes prioritarias

- `backend/app/routes.py` para movimientos, filtros y modelos de respuesta.
- `frontend/src/lib/financial-types.ts` para nombres y enumeraciones del
  contrato.
- `frontend/src/lib/financial-utils.ts` para fórmulas, agrupación y formato.
- `frontend/src/App.tsx` y el componente KPI o gráfico directamente implicado.
- Pruebas cercanas, en `backend/tests/` o junto a las utilidades de frontend.

### Evaluación de activación y comportamiento

Ejecutar estos escenarios con el agente que consumirá la skill:

| Escenario | Resultado esperado |
|---|---|
| KPI de ingresos no coincide con movimientos proporcionados | Activar; recalcular y mostrar evidencia. |
| Fecha del primer día aparece en el mes anterior | Activar; inspeccionar parseo y agrupación temporal. |
| Hay movimientos, pero el gráfico informa ausencia porque el margen es cero | Activar; distinguir ceros de lista vacía. |
| Pregunta general sobre cómo se calcula el margen | No activar el diagnóstico; responder la pregunta directamente. |
| Petición de cambiar colores sin reportar discrepancias | No activar el diagnóstico financiero. |

La evaluación se considera aprobada solo si los tres casos positivos activan la
skill y producen diagnósticos basados en evidencia, los dos casos negativos no
la activan y ningún caso conduce a inventar datos o a modificar archivos.
Registrar la fecha, los escenarios ejecutados y los fallos observados junto al
historial de versiones. Hasta ejecutar esta evaluación, su resultado permanece
pendiente.

### Versionado

- Mantener `metadata.version` en formato `MAJOR.MINOR.PATCH`.
- Incrementar `PATCH` para aclaraciones sin cambiar activación ni alcance;
  `MINOR` para añadir escenarios o pasos compatibles; `MAJOR` para cambiar el
  alcance, las reglas de activación o el formato del informe.
- Registrar cada versión y el resultado de evaluación en este historial.

#### Historial

- `0.1.0`: primera versión; evaluación pendiente.