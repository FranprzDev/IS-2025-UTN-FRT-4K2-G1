Feature: Modulo de autenticación para los distintos tipos de usuarios del sistema.
    Como usuario del sistema
    Quiero poder registrarme e iniciar sesión en el sistema
    Para poder acceder a las actividades que me son otorgadas

    Contexto del dominio: 
    - Los datos del usuario son: Email (String, mandatorio, respetando el formato de Email).
                                 Contraseña (String, mandatorio, minimo de longitud de 8 caracteres)
                                 Autoridad vinculada (o rol) (ej: medico, enfermera) 

Scenario: Registrar un nuevo usuario en el sistema.
Given que el usuario no posee un usuario previamente registrado
When se completa el registro con los siguientes datos:
|Email              |Contraseña   |Rol   |
|Goniposse@gmail.com|Contraseña123|Médico|
Then El sistema muestra el siguiente mensaje: "Usuario generado con éxito"
And redirige al usuario a la página de inicio de sesión.

Scenario: Registrar un nuevo usuario que ya existe en el sistema.
Given que el siguiente usuario ya se encuentra registrado en el sistema:
|Email              |Contraseña   |
|Goniposse@gmail.com|Contraseña123|
When Se intenta registrar el siguiente usuario:
|Email              |Contraseña   |Rol   |
|Goniposse@gmail.com|Abrakadabra43|Médico|
Then el sistema muestra el siguiente mensaje de error: "Usuario o contraseña inválidos."

Scenario: Intentar registrar un usuario con email que no respeta el formato.
Given que el usuario no posee un usuario previamente registrado
When se intenta registrar el siguiente usuario:
|Email    |Contraseña   |Rol   |
|Gonchi321|Contraseña123|Médico|
Then el sistema muestra el siguiente mensaje de error: "El Email no respeta el formato Nombre@email.com"


Scenario: Intentar registrar un usuario con una contraseña menor a los 8 caracteres.
Given que el usuario no posee un usuario previamente registrado
When se intenta registrar el siguiente usuario:
|Email              |Contraseña   |Rol   |
|Goniposse@gmail.com|1234         |Médico|
Then el sistema muestra el siguiente mensaje de error: "La contraseña debe tener al menos 8 caracteres."

Scenario: Intentar registrar un usuario sin contraseña o sin email.
Given que el usuario no posee un usuario previamente registrado
When se intenta registrar el siguiente usuario:
|Email              |Contraseña   |Rol   |
|                   |Contraseña123|Médico|
Then el sistema muestra el siguiente mensaje de error: "Se debe completar el campo <campo>."

examples:
|campo     |
|Email     |
|Contraseña|

Scenario: Intentar iniciar sesion con una cuenta invalida.
Given que los siguientes usuarios se encuentran registrados en el sistema:
|Email                   |Contraseña   |Rol      |
|Goniposse@gmail.com     |contraseña123|Médico   |
|FranciscoPerez@gmail.com|FranCapo123  |enfermero|
When se intenta iniciar sesion con el siguiente usuario:
|Email              |Contraseña|
|FlorPerez@gmail.com|tortilla38|
Then El sistema muestra el siguiente mensaje de error: "Usuario o contraseña invalidos."

Scenario: Intentar iniciar sesion con una cuenta valida.
Given que los siguientes usuarios se encuentran registrados en el sistema:
|Email                   |Contraseña   |Rol      |
|Goniposse@gmail.com     |contraseña123|Médico   |
|FranciscoPerez@gmail.com|FranCapo123  |enfermero|
|FlorPerez@gmail.com     |Tortilla38   |Médico   |
When se intenta iniciar sesion con el siguiente usuario:
|Email              |Contraseña|
|FlorPerez@gmail.com|tortilla38|
Then El sistema muestra el siguiente mensaje: "Sesión iniciada con éxito."
And permite al usuario acceder al sistema.