const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Simular una sesión simple
let isLoggedIn = false;

// Middleware para procesar datos JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/main', (req, res) => {
    console.log(`Estado de isLoggedIn en /main: ${isLoggedIn}`); // Debugging
    if (isLoggedIn) {
        res.sendFile(path.join(__dirname, 'public', 'main.html'));
    } else {
        res.redirect('/'); // Redirige al login si no está autenticado
    }
});



// Ruta para manejar login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validación simple de credenciales
    if (username === 'admin' && password === '1234') {
        isLoggedIn = true; // Marcar como autenticado
        res.redirect('/main'); // Redirige a la página principal
    } else {
        // En caso de credenciales incorrectas
        res.status(401).send(`
            <script>
                alert('Credenciales inválidas. Inténtalo de nuevo.');
                window.location.href = '/';
            </script>
        `);
    }
});

// Ruta para manejar logout
app.get('/logout', (req, res) => {
    isLoggedIn = false; // Finaliza la sesión
    res.redirect('/'); // Redirige al login
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
