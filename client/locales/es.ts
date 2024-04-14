export default{
    successAlerts:{
        "successfulLogin":"Inicio de sesión exitoso",
        "successfulSignup":"Usuario registrado exitosamente. Le llegará un correo para verificar la cuenta.",
        "successfulVideoUpload":"Video subido correctamente",
        "successfulVideoDelete":"Video eliminado correctamente",
        "successfulVideoEdited":"Video editado correctamente",
        "successUserUpdate":"Usuario actualizado correctamente",
        "successUserProfilePictureUpdate":"Foto de perfil actualizada correctamente",
        "successDeleteComment":"Commentario eliminado correctamente",
        "successPostComment":"Commentario enviado correctamente"
    },
    
    errorAlerts:{
        "invalidPassword":"Contraseña incorrecta",
        "invalidEmail":"Email inválido",
        "fillError":"Todos los campos deben contener información",
        "emailAlreadyRegistered":"El correo electrónico ya está registrado",
        "usernameAlreadyRegistered":"El nombre de usuario ya está registrado",
        "signupPasswordError":"La contaseña debe ser de 5-10 caracteres, y contener al menos una mayúscula, una minúscula, un número y un caracter especial",
        "loginError":"Debe iniciar sesión",
    },
    navbar:{
        "editProfile":"Editar Perfil",
        "login":"Iniciar sesión",
        "logout":"Cerrar sesión",
        "myVideos":"Mis videos",
        "search":"Buscar",
        "signup":"Registrarse",
        "uploadVideo":"Subir video",
        "me":'Yo',
        "mySubscriptions":" Mis subscripciones",
    },
    footer:{
        "footer":"Wetube © 2024 - Todos los derechos reservados"
    },
    signup:{
        "email":"Correo electrónico",
        "name":"Nombre",
        "password":"Contraseña",
        "passwordText":"La contaseña debe ser de 5-10 caracteres, y contener al menos una mayúscula, una minúscula, un número y un caracter especial.","signupButton":"Registrarse","signupHeader":"Credenciales",
        "username":"Nombre de usuario. max. 20 caracteres"
    },
    login:{
        "credentials":"Credenciales",
        "email":"Correo electrónico",
        "loginButton":"Iniciar sesión",
        "password":"Contraseña"
    },
    profile:{
        "email":"Correo electrónico",
        "name":"Nombre",
        "profile":"Perfil",
        "updateUserButton":"Actualizar usuario","username":"Nombre de usuario"
    },
    myVideos:{
        "deleteButton":"Borrar",
        "deleteVideoNo":"No",
        "deleteVideoText":"Desea eliminar el video?",
        "deleteVideoYes":"Sí","editButton":"Editar","myVideos":"Mis videos",
        "videoDescription":"Descripción del video",
        "videoName":"Nombre del video"
    },
    watch:{
        "commentButton":"Enviar comentario",
        "comments":"Comentarios",
        "commentText":"Escribe un comentario. Max. 1000 caracteres.",
        "deleteComment":"Borrar",
        "description":"Descripción",
        "views":"visualizaciones",
    },
    uploadVideo:{
        "videoText":"Video",
        "videoNamePlaceholder":"Nombre del video. max. 100 caracteres.",
        "videoDescriptionPlaceholder":"Decripción del video. max. 1000 caracteres.",
        "uploadButton":"Subir video"
    },
    searchResults:{
        "resultsTitle":"Resultados para",
        "noResults":"Sin resultados"
    },
    subscribe:{
        "subscribeButton":"Suscribirse",
        "unsubscribeButton":"Desuscribirse",
    },
    subscriptions:{
        "subscriptions":"Subscripciones",
    },
    verifyEmail:{
        "emailTitle":"Wetube account verification",
        "emailMessage":"Haga click en el enlace para verificar la cuenta de Wetube: ",
        "verify":"verificar",
        "verified":"Usuario verificado correctamente",
    },
    videos:{
        "noVideos":"Sin videos",
    }
} as const