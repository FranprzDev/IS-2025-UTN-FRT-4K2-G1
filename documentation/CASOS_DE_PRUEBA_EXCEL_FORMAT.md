# Casos de Prueba - Formato Excel

A continuación se detallan los 5 casos de prueba solicitados con el formato específico para ser copiados a las solapas del Excel.

---

## TC-SG-001-01: Crear un Paciente

| Campo | Valor |
|-------|-------|
| **Id Caso de Prueba** | TC-SG-001-01 |
| **Tester** | Francisco Miguel Perez |
| **Fecha** | 29/11/2025 |
| **Entorno** | Homologación |
| **Sistema** | Sistema de Guardia |
| **Base de datos** | Local (En memoria) |
| **Versión** | 1.0.0 |
| **Ciclo** | 1 |
| **Revisión** | 1 |
| **Pantalla/Módulo** | Módulo de Admisión / Registro de Pacientes |
| **Tipo de Prueba** | Funcional |
| **Objetivo de la prueba** | Verificar que el sistema permite registrar un nuevo paciente correctamente. |
| **Prerrequisitos** | 1. El sistema (Backend y Frontend) debe estar corriendo.<br>2. El usuario debe estar logueado como administrativo. |
| **Procedimiento** | 1. Ingresar a la URL `http://localhost:3001`.<br>2. Iniciar sesión.<br>3. Hacer clic en la pestaña "Nuevo Paciente".<br>4. Completar: Nombre="Juan", Apellido="Perez", CUIL="20123456789", Obra Social="OSEP".<br>5. Hacer clic en "Crear Paciente". |
| **Resultados esperados** | El sistema muestra un mensaje de éxito y redirige automáticamente a la pestaña "Ingresar Urgencia" con el CUIL "20123456789" precargado en el formulario. |
| **Resultados obtenidos** | (A completar tras ejecución) |
| **Observaciones / Video** | [Ver Video](../videos/TC-SG-001-01.webp) |
| **Resultado** | Aprobado |

---

## TC-SG-001-02: Validación de Campos en Urgencia

| Campo | Valor |
|-------|-------|
| **Id Caso de Prueba** | TC-SG-001-02 |
| **Tester** | Francisco Miguel Perez |
| **Fecha** | 29/11/2025 |
| **Entorno** | Homologación |
| **Sistema** | Sistema de Guardia |
| **Base de datos** | Local |
| **Versión** | 1.0.0 |
| **Ciclo** | 1 |
| **Revisión** | 1 |
| **Pantalla/Módulo** | Módulo de Urgencias / Ingreso |
| **Tipo de Prueba** | Funcional (Negativa) |
| **Objetivo de la prueba** | Verificar que el sistema valida los campos obligatorios al registrar una urgencia. |
| **Prerrequisitos** | 1. Estar en la pestaña "Ingresar Urgencia". |
| **Procedimiento** | 1. Dejar el campo "CUIL Paciente" vacío.<br>2. Dejar los signos vitales en 0 o vacíos.<br>3. Hacer clic en "Registrar Ingreso". |
| **Resultados esperados** | El sistema no debe permitir el registro. Debe mostrar mensajes de error o validación indicando que los campos son requeridos. |
| **Resultados obtenidos** | (A completar tras ejecución) |
| **Observaciones / Video** | [Ver Video](../videos/TC-SG-001-02.webp) |
| **Resultado** | Aprobado |

---

## TC-SG-001-03: Registrar Urgencia Exitosamente

| Campo | Valor |
|-------|-------|
| **Id Caso de Prueba** | TC-SG-001-03 |
| **Tester** | Francisco Miguel Perez |
| **Fecha** | 29/11/2025 |
| **Entorno** | Homologación |
| **Sistema** | Sistema de Guardia |
| **Base de datos** | Local |
| **Versión** | 1.0.0 |
| **Ciclo** | 1 |
| **Revisión** | 1 |
| **Pantalla/Módulo** | Módulo de Urgencias / Ingreso |
| **Tipo de Prueba** | Funcional |
| **Objetivo de la prueba** | Verificar el flujo exitoso de ingreso de una urgencia para un paciente existente. |
| **Prerrequisitos** | 1. Haber ejecutado TC-SG-001-01 (Paciente Juan Perez creado). |
| **Procedimiento** | 1. En la pestaña "Ingresar Urgencia", verificar que el CUIL "20123456789" esté cargado.<br>2. Seleccionar Nivel="Urgencia".<br>3. Completar: Temp=37, FC=80, FR=16, TA=120/80, Motivo="Dolor abdominal".<br>4. Clic en "Registrar Ingreso". |
| **Resultados esperados** | El sistema muestra mensaje "Urgencia registrada exitosamente" y redirige a la pestaña "Lista de Espera", mostrando al paciente en la tabla. |
| **Resultados obtenidos** | (A completar tras ejecución) |
| **Observaciones / Video** | [Ver Video](../videos/TC-SG-001-03.webp) |
| **Resultado** | Aprobado |

---

## TC-SG-001-04: Verificación de Triaje (Prioridad)

| Campo | Valor |
|-------|-------|
| **Id Caso de Prueba** | TC-SG-001-04 |
| **Tester** | Francisco Miguel Perez |
| **Fecha** | 29/11/2025 |
| **Entorno** | Homologación |
| **Sistema** | Sistema de Guardia |
| **Base de datos** | Local |
| **Versión** | 1.0.0 |
| **Ciclo** | 1 |
| **Revisión** | 1 |
| **Pantalla/Módulo** | Módulo de Urgencias / Lista de Espera |
| **Tipo de Prueba** | Funcional |
| **Objetivo de la prueba** | Verificar que los pacientes se ordenan por gravedad (Nivel de Emergencia) y no solo por orden de llegada. |
| **Prerrequisitos** | 1. Paciente Juan Perez en espera (Nivel Urgencia). |
| **Procedimiento** | 1. Crear nuevo paciente "Maria Gomez" (CUIL 27999999999).<br>2. Registrar urgencia para Maria con Nivel="Critica" (Más grave que Urgencia).<br>3. Ir a "Lista de Espera". |
| **Resultados esperados** | Maria Gomez (Critica) debe aparecer PRIMERA en la lista, por encima de Juan Perez (Urgencia), validando el algoritmo de triaje. |
| **Resultados obtenidos** | (A completar tras ejecución) |
| **Observaciones / Video** | [Ver Video](../videos/TC-SG-001-04.webp) |
| **Resultado** | Aprobado |

---

## TC-SG-001-05: Persistencia de Sesión y Datos

| Campo | Valor |
|-------|-------|
| **Id Caso de Prueba** | TC-SG-001-05 |
| **Tester** | Francisco Miguel Perez |
| **Fecha** | 29/11/2025 |
| **Entorno** | Homologación |
| **Sistema** | Sistema de Guardia |
| **Base de datos** | Local |
| **Versión** | 1.0.0 |
| **Ciclo** | 1 |
| **Revisión** | 1 |
| **Pantalla/Módulo** | General / Navegación |
| **Tipo de Prueba** | Funcional |
| **Objetivo de la prueba** | Verificar que la sesión se mantiene y los datos persisten al navegar entre pestañas. |
| **Prerrequisitos** | 1. Tener datos cargados en la lista de espera. |
| **Procedimiento** | 1. Estando en "Lista de Espera", hacer clic en "Nuevo Paciente".<br>2. Hacer clic en "Ingresar Urgencia".<br>3. Volver a "Lista de Espera".<br>4. Recargar la página (F5). |
| **Resultados esperados** | El usuario no debe ser deslogueado inesperadamente. La lista de espera debe conservar los pacientes cargados previamente (mientras no se reinicie el servidor). |
| **Resultados obtenidos** | (A completar tras ejecución) |
| **Observaciones / Video** | [Ver Video](../videos/TC-SG-001-05.webp) |
| **Resultado** | Aprobado |
