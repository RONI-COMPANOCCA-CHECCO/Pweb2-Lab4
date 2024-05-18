document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('file-list');
    const fileContent = document.getElementById('file-content');
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');

    // Listar archivos Markdown disponibles
    fetch('/api/files')
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file;
                li.addEventListener('click', () => {
                    fetch(`/api/files/${file}`)
                        .then(response => response.text())
                        .then(html => {
                            fileContent.innerHTML = html;
                        });
                });
                fileList.appendChild(li);
            });
        });

    // Subir nuevo archivo Markdown
    uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        fetch('/api/files', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            location.reload();
        });
    });
});
