# Estado del proyecto

La revision inicial fue estatica. Los cambios y verificaciones posteriores se
registran por separado; "Funciona" no implica validacion integral del producto.

## Funciona
- El dashboard consulta `/api/metrics`, calcula cuatro KPIs y presenta dos graficos mensuales, con estados de carga y error. Fuente: [App.tsx](../frontend/src/App.tsx).
- Las utilidades calculan ingresos, gastos, beneficio y margen; sin ingresos, el margen es cero. Fuente: [financial-utils.ts](../frontend/src/lib/financial-utils.ts).
- La API genera 360 movimientos mock durante los doce meses completos anteriores al mes actual. Ofrece filtros, endpoints B2B/B2C, facetas, resumenes, categorias principales, comparaciones y alertas. Fuente: [routes.py](../backend/app/routes.py).
- Existen pruebas de calculos basicos y endpoints. Vitest frontend paso 5 pruebas; las pruebas backend no se ejecutaron. Fuentes: [financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts), [test_routes.py](../backend/tests/test_routes.py).

## Limitaciones actuales
- La agrupacion mensual usa getters locales sobre fechas ISO y puede desplazar el primer dia al mes anterior segun la zona horaria. Fuente: [financial-utils.ts](../frontend/src/lib/financial-utils.ts).
- Corregido: el periodo del encabezado se deriva de los meses disponibles y el grafico de margen distingue puntos con valor cero de una lista vacia. Fuentes: [App.tsx](../frontend/src/App.tsx), [profit-percent-chart.tsx](../frontend/src/components/dashboard/profit-percent-chart.tsx).
- El frontend no valida la estructura del JSON recibido y el backend no rechaza rangos de fechas invertidos. Fuentes: [App.tsx](../frontend/src/App.tsx), [routes.py](../backend/app/routes.py).
- Cada generacion de mocks reinicializa el generador aleatorio global; existe riesgo de interferencia entre peticiones concurrentes. Fuente: [routes.py](../backend/app/routes.py).
- Algunas pruebas verifican solo estructuras o respuestas no vacias: no demuestran resultados numericos de comparacion ni deteccion de alertas. Fuente: [test_routes.py](../backend/tests/test_routes.py).
- La configuracion Docker usa depurador y recarga, y CORS permite todos los origenes con credenciales habilitadas. No se ha acreditado preparacion para produccion. Fuentes: [Dockerfile](../backend/Dockerfile), [docker-compose.yml](../docker-compose.yml), [main.py](../backend/app/main.py).
- Los datos son simulados. La interfaz solo consume movimientos; las capacidades adicionales de la API no son controles disponibles en pantalla. Fuentes: [routes.py](../backend/app/routes.py), [App.tsx](../frontend/src/App.tsx).

## Proximos pasos sugeridos
Son propuestas pendientes, no correcciones implementadas ni funcionalidades comprometidas.

1. Corregir la agrupacion mensual dependiente de la zona horaria y comprobar primeros de mes en distintas zonas. Fuente: [financial-utils.ts](../frontend/src/lib/financial-utils.ts).
2. Validar el JSON y rechazar fechas invertidas, con pruebas de entradas invalidas. Fuentes: [App.tsx](../frontend/src/App.tsx), [routes.py](../backend/app/routes.py).
3. Ampliar pruebas con datos controlados y resultados numericos exactos; controlar fecha y aleatoriedad. Fuentes: [financial-utils.test.ts](../frontend/src/lib/financial-utils.test.ts), [test_routes.py](../backend/tests/test_routes.py).
4. Aislar el generador aleatorio y separar configuraciones de desarrollo y produccion. Fuentes: [routes.py](../backend/app/routes.py), [Dockerfile](../backend/Dockerfile), [main.py](../backend/app/main.py).
5. Como evolucion opcional, incorporar filtros existentes de la API a la interfaz. Fuentes: [routes.py](../backend/app/routes.py), [App.tsx](../frontend/src/App.tsx).
6. Ejecutar las pruebas pertinentes y, para cambios de frontend, lint y build; registrar resultados y pendientes en [verificacion.md](../verificacion.md). Comandos documentados en [AGENTS.md](../AGENTS.md).

## Skills

- `accessibility` está presente en [.agents/skills/accessibility/SKILL.md](../.agents/skills/accessibility/SKILL.md). No se aplicó en este trabajo visual; no se verificaron cambios ni pruebas de accesibilidad.
- `frontend-design` está presente en [.agents/skills/frontend-design/SKILL.md](../.agents/skills/frontend-design/SKILL.md) y fue la skill pública elegida porque la tarea era revisar jerarquía y presentación visual. Frente a skills públicas más específicas de accesibilidad o rendimiento, esta coincidía directamente con el objetivo. Cambios verificados: periodo dinámico, gráfico que conserva series de margen cero y mayor énfasis visual del KPI de beneficio. Vitest pasó 5 pruebas; lint y build pasaron. Vite informó HMR; no se tomaron capturas.
- `vercel-react-best-practices` está presente en [.agents/skills/vercel-react-best-practices/SKILL.md](../.agents/skills/vercel-react-best-practices/SKILL.md) y se consultó durante los cambios React. No se implementó ni verificó una optimización de rendimiento específica.
- `financial-discrepancy-investigator` es la skill interna de [.agents/skills/financial-discrepancy-investigator/SKILL.md](../.agents/skills/financial-discrepancy-investigator/SKILL.md), versión `0.1.0`. Se revisaron manualmente cinco escenarios: tres de discrepancia y dos negativos. La comprobación horaria confirmó que `2024-02-01` cae en enero local bajo `America/Los_Angeles`, coherente con la agrupación actual. No se validó la activación automática de Copilot; queda pendiente antes de declararla aprobada.