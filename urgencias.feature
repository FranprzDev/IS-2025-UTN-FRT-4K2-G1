Feature: Registro de admisiones en el módulo de urgencias
Como enfermera
Quiero poder registrar las admisiones de los pacientes a urgencias
Para determinar qué pacientes tienen mayor prioridad de atención

Background:
Given que la enfermera está autenticada en el sistema
And que el módulo de urgencias está disponible

Scenario: Registrar ingreso de un paciente existente con todos los datos obligatorios
Given que existe un paciente identificado en el sistema
And que la enfermera ingresa todos los datos obligatorios correctamente
| fechaIngreso || informe | nivelEmergencia | estado | temperatura | frecCardiaca | frecRespiratoria | tensionArterial |
| 7/10/2025 | "Dolor en el pecho" | "Crítica" | PENDIENTE | 38.2 | 90 | 20 | 120/80 | 
When la enfermera registra la admisión
Then el sistema guarda el ingreso del paciente
And el paciente entra en la cola de atención

Scenario: Registrar ingreso de un paciente no existente en el sistema
Given que el paciente no existe en el sistema
When la enfermera intenta registrar la admisión
Then el sistema solicita crear el paciente antes de continuar
And una vez creado el paciente, se procede al registro de ingreso

Scenario: Registrar ingreso con dato obligatorio faltante
Given que el paciente existe en el sistema
And que la enfermera omite el dato ""
When intenta registrar la admisión
Then el sistema muestra un mensaje de error indicando que falta el dato ""

Examples:  
  | campo                 |
  | informe               |
  | nivel de emergencia   |
  | frecuencia cardíaca   |
  | frecuencia respiratoria |
  | tensión arterial      |

Scenario: Registrar ingreso con valores negativos en frecuencias
Given que el paciente existe en el sistema
And que la enfermera ingresa un valor negativo en "| frecCardiaca | frecRespiratoria |"
When intenta registrar la admisión
Then el sistema muestra un mensaje de error indicando que los valores de frecuencia no pueden ser negativos

Scenario: Ingreso de paciente con mayor nivel de emergencia
Given que hay un paciente B en espera con nivel de emergencia "Urgencia"
And que la enfermera registra un nuevo paciente A con nivel de emergencia "Crítica"
When ambos pacientes están en la lista de espera
Then el sistema debe atender primero al paciente A antes que al paciente B

Scenario: Ingreso de paciente con menor nivel de emergencia
Given que hay un paciente B en espera con nivel de emergencia "Crítica"
And que la enfermera registra un nuevo paciente A con nivel de emergencia "Urgencia"
When ambos pacientes están en la lista de espera
Then el sistema debe atender primero al paciente B antes que al paciente A

Scenario: Ingreso de paciente con el mismo nivel de emergencia
Given que hay un paciente B en espera con nivel de emergencia "Urgencia"
And que la enfermera registra un nuevo paciente A con nivel de emergencia "Urgencia"
And que el paciente B ingresó antes al sistema
When ambos pacientes están en la lista de espera
Then el sistema debe atender primero al paciente B por orden de llegada
