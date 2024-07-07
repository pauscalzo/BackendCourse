# Entrega Final

Se trata del backend de una aplicación de ecommerce. Para la misma se trabajó con una base de datos en Mongo y se deployó en Railway: https://backendcourse-production-f777.up.railway.app/products?page=1.
Pasaré a explicar un poco su funcionamiento:

### 1) SignUp:




#### Para un nuevo registro nos dirigimos a la ruta /signup:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20140128.png)

#### Al intentar hacer un registro sin llenar todos los campos aparece un error:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20140741.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20140757.png)

#### Al utilizar un mail que es de un usuario existente también aparece un error:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20141226.png)

#### Al realizar un registro exitoso redirige al login y se crea un nuevo usuario en la base de datos:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20141708.png)

##### Como puede observarse la contraseña esta hasheada, se le asigna por defecto el role user, se le crea de manera automática un carrito de compras con su ID, se crea un array de documentos, para poder subir por postman documentos para poder cambiar su role y un campo de last_conection que registra la última vez que se logueo. Actualmente es null porque no se logueo nunca aún. Vamos a loguearnos!








### 2) Login:

#### Así se ve la vista de login:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20142254.png)

#### Puede ocurrir que el mail no se encuentre entre los usuarios o bien que la contraseña sea incorrecta. Entonces aparecerá el siguiente error:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20142616.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20142633.png)

#### Si se olvidó la contraseña y clickeamos el link nos lleva a la siguiente ruta:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20142841.png)

#### si agregamos el mail correspondiente llega un mensaje de éxito y un mail para reestablecer la contraseña:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20143210.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20143326.png)

#### Al clickear sobre el enlace nos lleva a esta ruta:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20143616.png)

#### Cambiamos la contraseña y nos muestra este mensaje:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20143801.png)

#### Ahora si! hacemos un login exitoso y podemos ver como ahora sí aparece en la base de datos la fecha de la última conexión:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20144036.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20144201.png)

### 3) Accesos:

#### Este usuario con su role de user tendra acceso a algunas rutas pero no tendrá acceso a otras. Por ejemplo no tiene acceso a la ruta protegida /current, al intentar ingresar le aparece este mensaje:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-05%20144448.png)

### 4) Proceso de Compra:

#### Al dirigirse a la ruta /products podra visualizar los productos:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20161346.png)

#### Agregamos productos al carrito, algunos que tienen stock y otros que no tienen stock pero todos se agregan:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20161629.png)

#### Al clickear el botón de arriba a la izquierda de ir al carrito podemos visualizar el carrito:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20161852.png)

#### Podemos ver en la base de datos como se visualiza el carrito:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20162048.png)

#### Ahora procedemos a Finalizar Compra clickeando el botón, y se obtiene el siguiente mensaje:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20162207.png)

#### El carrito se visualiza así despues de la compra. Permanece sólo el producto que no tenía stock:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20162207.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20162412.png)

#### Se genera el ticket con el monto de lo que se compró excluyendo el producto que no tenía stock:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20162700.png)

### 5) Agregar un producto y eliminarlo:

#### Si ingresamos como usuario premium o admin podemos acceder a crear, editar y eliminar un producto. Me registro como premium y me dirijo a la ruta protegida /current y visualizo lo siguiente:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20163040.png)

#### Agregamos un producto llenando el formulario y vemos el siguiente mensaje:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20163440.png)

#### Así se visualiza el nuevo producto en la base de datos (con el campo owner) y en la ruta /products:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20163728.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20163704.png)

#### Si eliminamos un producto creado por un user premium desde el formulario de la ruta /current:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20163953.png)

#### y al usuario premium le llega un mail avisandole que su producto ha sido eliminado:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20164139.png)

### 6) Admin de Users:

#### Si ingresamos como usuario admin podemos acceder al admin de users en la siguiente ruta /api/sessions/users:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20164818.png)

#### En esta ruta se puede actualizar el rol de los usuarios o eliminarlos. Primero modifico el rol del usuario TestFinal y luego lo elimino:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20165018.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20165041.png)

#### Queda de esta forma la vista. Con 4 usuarios. Uno, sin embargo no está activo hace más de dos semanas. Lo visualizamos en la base de datos y luego clickeamos el botón de eliminar usuarios inactivos:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20165356.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20165405.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20165419.png)

#### Al usuario cuya cuenta fue borrada por inactividad se le envía un mail notificandole:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-07-07%20165700.png)




