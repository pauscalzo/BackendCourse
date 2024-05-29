
# Ecommerce Back End

Voy a ir punto por punto mostrando lo solicitado:

### 1) Recibir por query params un limit (opcional), si no recibe el límite será 10.




#### Capturas desde el Navegador

a - si hay límite:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20123814.png)

b - si no hay límite, se muestran 10:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20125511.png)


### 2) Recibir por query params una page (opcional), si no recibe el límite será la 1.

a - page # 1:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20130054.png)

b - page # 2:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20125940.png)

c - sin especificar page:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20125511.png)

### 3) Recibir por query params un sort (opcional), que ordene de manera ascendente y descendente por precio.

a - ascendente:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20130508.png)

b - descendente:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20130753.png)

### 4) Recibir por query params un query (opcional), por categoría y por disponibilidad.

a - por categoría:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20133041.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20133158.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20133314.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20133419.png)

b - por disponibilidad:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20133533.png)

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20133628.png)

### 5) Tambien sumar orden por precio a lo anterior.

a - categoría playmobil precio ascendente:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20133921.png)

b - status disponible precio descendente:

![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20134037.png)

### 6) Modificar el código para incorporar Populate en el método de agregar al carrito.

a - En postman muestro respuesta trás aplicar el método POST en la ruta /carts/cid/pid:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20134801.png)

b - En la base de datos corroboro que el producto ha sido agregado al carrito con éxito:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20135142.png)

### 7) Vista de Carrito con los productos del carrito a través de la ruta api/carts/:cid.

a - En el navegador:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20135439.png)

### 8) Actualizar la cantidad de un producto en el carrito por req.body a través de la ruta /carts/:cid/products/:pid con PUT.

a - En Postman:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20135852.png)

b - En la base de datos corroboro que el producto ha sido editado con éxito:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20140452.png)

### 9) Eliminar un producto del carrito con DELETE a través de la ruta /carts/:cid/products/:pid.

a - En Postman:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20140751.png)

b - En la base de datos corroboro que el producto ha sido eliminado con éxito:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20140905.png)

### 10) Eliminar todos los productos del carrito con DELETE a través de la ruta /carts/:cid/.

a - En Postman:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20141510.png)

b - En la base de datos corroboro que el carrito esta vacío:
![App Screenshot](https://www.entropiadigital.com.ar/IMG/Captura%20de%20pantalla%202024-02-28%20141624.png)

### 11) El método para actualizar el carrito solicitado en la consigna de la entrega lo utilicé en los métodos de PUT y DELETE recién mostrados para actualizar el carrito. El método se encuentra en la línea 74 del archivo CartManagerMongo.js y se encuentra aplicado en las líneas 99, 123 y 143 del mismo archivo.

### 12) En capturas anteriores se pudo ver que la paginación esta agregada, al dirigirse a /products se puede navegar entre la página anterior y la siguiente.



