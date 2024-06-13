# Noveno Desafío

Nos encontramos ante dos entornos distintos. El entorno de desarrollo y el entorno de producción. Voy a seguir los mismos pasos para los dos y mostrar las diferencias:

### 1) Entorno de Desarrollo:




#### En primer lugar muestro como está inicialmente la terminal y al archivo errors.log:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131146.png)

#### Voy a realizar un signup erroneo con un mail que ya tiene un usuario registrado

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131018.png)





#### Al realizar el registro fallido ahora la terminal se ve así:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131229.png)

#### Ahora me voy a dirigir a una ruta permitida para el usuario:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131250.png)

#### En la terminal se ve así:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131300.png)

#### Luego me dirijo a una ruta no permitida para el rol del usuario:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131317.png)

#### En la terminal se ve así:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131331.png)

Como podemos observar se registran los mensajes desde debug y no se imprime nada en el archivo errors.log.

### 1) Entorno de Producción:

#### Al realizar el registro fallido ahora la terminal y el archivo errors.log se ve así:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131457.png)

#### Al dirigirme a una ruta permitida para el usuario se ve así:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131523.png)

#### Si me dirijo a la ruta no permitida, la terminal y el archivo se verán así:

![App Screenshot](https://paulascalzo.site/IMG/Captura%20de%20pantalla%202024-05-04%20131548.png)

Como podemos observar cuando estamos en el entorno de producción el nivel debug ya no se muestra y a partir del nivel warning se imprime en el archivo.

