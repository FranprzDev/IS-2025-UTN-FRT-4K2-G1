Feature: Modulo para la creación de informes de atención.
    Como médico
    Quiero registrar un informe de atención de un paciente ingresado en urgencias que he reclamado
    Para dejar constancia de la atención brindida a dicho paciente

    - La atención posee los siguientes datos: Ingreso, Informe, Médico.
    - Una vez finalizada la atención se debe cambiar el estado del ingreso a finalizado.

Background: 
    Given que el siguiente médico esta registrado:
    |Nombre   |Apellido | 
    |Francisco|Perez    |

Scenario: El médico registra la atención del paciente reclamado con el informe solicitado.
    Given que el siguiente ingreso esta registrado:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
    |23-44920883-9|Tiene vomito  |Emergencia         |38         |70                 |15                     |120/80          |
    When El medico registra la atencion con el siguiente informe:
    |Paciente      |Nombre Doctor |Apellido Doctor |Informe                                                  |
    |23-44920883-9 |Francisco     |Perez           |El paciente esta con gastroenteritis y se le dio un suero|
    Then se registra la atencion
    And el estado del ingreso del paciente con cuil:23-44920883-9 pasa a ser "FINALIZADO"

Scenario: El médico registra la atención del paciente reclamado omitiendo el informe.
    Given que el siguiente ingreso esta registrado:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
    |23-44920883-9|Tiene vomito  |Emergencia         |38         |70                 |15                     |120/80          |
    When El medico registra la atencion con el siguiente informe:
    |Paciente      |Nombre Doctor |Apellido Doctor |Informe |
    |23-44920883-9 |Francisco     |Perez           |        |
    Then el sistema muestra el siguiente mensaje de error: "Se ha omitido el informe de la atención".