1- Primero es definir como luce nuestro modelo por ejemplo definamos "Worker",
definimos una especie de "JSON" donde las llaves son los campos del modelo,
en nuestra BD y los valores son una simbologia para determinar, primero el tipo de dato,
luego, requerimeintos EJ:'+' => es requerido, @ => es correo , ** =>password

<!-- Worker{
    name:'' + show
    lastName:'' + show
    avatar:img show
    age: 12 + show
    birthday: dateonly + show
    email:'' @ + u
    CompanyId:Company + s=name show
    Tasks: [Task] s=title show
    status: |a|b|c|
} -->

2- El nombre del archivo .json debe llamarse struct.json