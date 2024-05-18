const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const upload = multer({ dest: 'markdown_files/' });

app.use(bodyParser.json());
app.use(express.static('public'));

// Manejar la solicitud para la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Listar archivos Markdown
app.get('/api/files', (req, res) => {
    fs.readdir('markdown_files', (err, files) => {
        if (err) return res.status(500).send('Error al listar archivos.');
        res.json(files.filter(file => file.endsWith('.md')));
    });
});

// Ver el contenido de un archivo Markdown traducido a HTML
app.get('/api/files/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'markdown_files', req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo.');
        res.send(marked(data));
    });
});

// Crear nuevos archivos Markdown y almacenarlos en el servidor
app.post('/api/files', upload.single('file'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'markdown_files', req.file.originalname);
    fs.rename(tempPath, targetPath, err => {
        if (err) return res.status(500).send('Error al guardar el archivo.');
        res.send('Archivo guardado exitosamente.');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
