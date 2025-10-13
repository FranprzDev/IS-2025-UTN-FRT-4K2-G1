Feature: Registro de admisiones en el módulo de urgencias
  Como enfermera
  Quiero poder registrar las admisiones de los pacientes a urgencias
  Para determinar qué pacientes tienen mayor prioridad de atención

  Contexto del dominio:
  - Campos obligatorios: Cuil, informe, nivelEmergencia, temperatura, frecuenciaCardiaca, frecuenciaRespiratoria, tensionArterial
  - Niveles de emergencia (orden de prioridad): Crítica > Emergencia > Urgencia > Urgencia Menor > Sin Urgencia

Background:
  Given que la siguiente enfermera esta registrada:
  |Nombre   |Apellido|
  |Florencia|   Perez|
  And que el módulo de urgencias está disponible

Scenario: Registrar ingreso de un paciente existente con todos los datos obligatorios
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre |Obra Social|
  |23-44920883-9|Posse   |Gonzalo|Osde       |
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44920883-9|Tiene vomito  |Emergencia         |38         |70                   |15                      |120/80          |
  Then el sistema guarda el ingreso del paciente
  And el paciente entra en la cola de atención con estado "PENDIENTE"

Scenario: Registrar ingreso de un paciente no existente en el sistema
  Given que el paciente no existe en el sistema
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44920883-9|Tiene vomito  |Emergencia         |38         |70                 |15                      |120/80          |
  Then el sistema muestra el siguiente mensaje: "El paciente debe ser registrado anteriormente."
  And el sistema redirige a la pantalla de creación de pacientes.

Scenario Outline: Registrar ingreso con dato obligatorio faltante
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre |Obra Social|
  |23-44920883-9|Posse   |Gonzalo|Osde       |
  And que la enfermera omite el dato "<campo>"

  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44920883-9|Tiene vomito  |Emergencia         |38         |                   |15                      |120/80          |
  
  Then el sistema muestra el siguiente error: "El campo "<campo>" debe estar completo"

  Examples:
  | campo                   |
  | informe                 |
  | nivel de emergencia     |
  | frecuencia cardíaca     |
  | frecuencia respiratoria |
  | tensión arterial        |

Scenario Outline: Registrar ingreso con valores negativos en frecuencias
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre   |Obra Social          |
  |23-44190234-4|Perez   |Francisco|Subsidio salud       |
  And que la enfermera ingresa un valor negativo en "<campo_frecuencia>"
 
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44190234-4|Tiene vomito  |Emergencia         |38         |-70                 |15                      |120/80         |
  Then el sistema muestra el siguiente error: "La "<campo_frecuencia>" no puede ser negativa"

  Examples:
  | campo_frecuencia        |
  | frecuencia cardíaca     |
  | frecuencia respiratoria |

Scenario Outline: Registrar ingreso con valores de temperatura fuera de rango médico
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre   |Obra Social          |
  |23-44190234-4|Perez   |Francisco|Subsidio salud       |
  
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44190234-4|Tiene vomito  |Emergencia         |50         |60                 |  15                    |120/80          |
  Then el sistema muestra el siguiente error: "La temperatura se encuentra fuera de rango"

Scenario Outline: Registrar ingreso con valores de frecuencia cardíaca fuera de rango médico
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre   |Obra Social          |
  |23-44190234-4|Perez   |Francisco|Subsidio salud       |
  
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44190234-4|Tiene vomito  |Emergencia         |37         |10                 |  15                    |120/80          |
  Then el sistema muestra el siguiente error: "La frecuencia cardíaca se encuentra fuera de rango"

Scenario Outline: Registrar ingreso con valores de frecuencia respiratoria fuera de rango médico
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre   |Obra Social          |
  |23-44190234-4|Perez   |Francisco|Subsidio salud       |
  
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44190234-4|Tiene vomito  |Emergencia         |37         |80                 |  120                    |120/80          |
  Then el sistema muestra el siguiente error: "La frecuencia respiratoria se encuentra fuera de rango"

Scenario Outline: Registrar ingreso con valores de tensión arterial fuera de rango médico
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre   |Obra Social          |
  |23-44190234-4|Perez   |Francisco|Subsidio salud       |
  
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
    |23-44190234-4|Tiene vomito  |Emergencia         |37         |80                 | 15                     |200/160         |
  Then el sistema muestra el siguiente error: "La tensión arterial se encuentra fuera de rango"

Scenario: Ingreso de paciente con mayor nivel de emergencia
  Given que estan registrados los siguientes pacientes:
      |Cuil         |Apellido      |Nombre   | Obra Social      |
      |23-44190234-4|Perez         |Francisco|Subsidio salud    |
      |23-44920883-4|Posse         |Gonzalo  |Osde              |
      |23-45985689-2|Parada Parejas|Manuel   |Sancor salud      |
    When Ingresan a urgencias los siguientes pacientes:
      |Cuil         |Informe         |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
      |23-44190234-4|Le duele el ojo |Sin Urgencia       |37         |70                 |15                      |120/80          |
      |23-44920883-4|Le agarro dengue|Emergencia         |38         |70                 |15                      |120/80          |
    Then La lista de espera esta ordenada por cuil de la siguiente manera:
      |Cuil         |
      |23-44920883-4|
      |23-44190234-4|

Scenario: Ingreso de paciente con el mismo nivel de emergencia
  Given que estan registrados los siguientes pacientes:
      |Cuil         |Apellido      |Nombre   | Obra Social      |
      |23-44190234-4|Perez         |Francisco|Subsidio salud    |
      |23-44920883-4|Posse         |Gonzalo  |Osde              |
      |23-45985689-2|Parada Parejas|Manuel   |Sancor salud      |
    When Ingresan a urgencias los siguientes pacientes:
      |Cuil         |Informe         |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
      |23-45985689-2|le agarro dengue|Emergencia         |38         |75                 |14                      |120/81          |              
      |23-44190234-4|Le duele el ojo |Sin Urgencia       |37         |70                 |15                      |120/80          |
      |23-44920883-4|Le agarro dengue|Emergencia         |38         |70                 |15                      |120/80          |
    Then La lista de espera esta ordenada por cuil de la siguiente manera:
      |Cuil         |
      |23-45985689-2|
      |23-44920883-4|
      |23-44190234-4|

Scenario: Paciente con múltiples niveles de prioridad en cola
  Given que estan registrados los siguientes pacientes:
      |Cuil         |Apellido      |Nombre   | Obra Social      |
      |23-44190234-4|Perez         |Francisco|Subsidio salud    |
      |23-44920883-4|Posse         |Gonzalo  |Osde              |
      |23-45985689-2|Parada Parejas|Manuel   |Sancor salud      |
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe         |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca| Frecuencia Respiratoria|Tension Arterial|
      |23-45985689-2|le agarro dengue|Urgencia           |38         |75                 |14                      |120/81          |              
      |23-44190234-4|Le duele el ojo |Sin Urgencia       |37         |70                 |15                      |120/80          |
      |23-44920883-4|Le agarro dengue|Emergencia         |38         |70                 |15                      |120/80          |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
      |Cuil         |
      |23-45985689-2|
      |23-44920883-4|
      |23-44190234-4|
