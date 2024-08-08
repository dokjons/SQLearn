// Load and settings for ace code editor
document.addEventListener('DOMContentLoaded', () => {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/sql");

    // Load previous content from localStorage if it exists
    const savedContent = localStorage.getItem('sqlQuery');
    if (savedContent) {
        editor.setValue(savedContent, -1); // Set editor content and move cursor to the beginning
    }

    // Save content to localStorage whenever it changes
    editor.getSession().on('change', function() {
        localStorage.setItem('sqlQuery', editor.getValue());
    });

    // Ensure the form submission captures the editor content
    document.querySelector("#code-form").addEventListener("submit", function() {
        document.getElementById("query").value = editor.getValue();
    });

    // Toggle dark mode
    document.getElementById('theme-toggle').addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        const editor = ace.edit("editor");
        if (editor) {
            editor.setTheme(isDarkMode ? "ace/theme/monokai" : "ace/theme/chrome");
        }
    });

    // Toggle slide menu
    const menuToggle = document.getElementById('menu-toggle');
    const slideMenu = document.getElementById('slide-menu');
    const contentContainer = document.querySelector('.container');
    const commandSearch = document.getElementById('search-commands');
    const commands = document.querySelectorAll('.command');

    menuToggle.addEventListener('click', () => {
        slideMenu.classList.toggle('open');
        
        if (slideMenu.classList.contains('open')) {
            slideMenu.style.width = '340px'; // Set the width when open
            contentContainer.style.marginRight = '340px'; // Push content
        } else {
            slideMenu.style.width = '0'; // Set the width to 0 when closed
            contentContainer.style.marginRight = 'auto'; // Reset content margin
        }
    });

    commandSearch.addEventListener('input', () => {
        const query = commandSearch.value.toLowerCase();
        commands.forEach(command => {
            const commandText = command.innerText.toLowerCase();
            if (commandText.includes(query)) {
                command.style.display = 'list-item';
            } else {
                command.style.display = 'none';
            }
        });
    });

    // Load the save theme
    window.onload = function() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('theme-toggle').checked = true;
            editor.setTheme("ace/theme/monokai");
        } else {
            editor.setTheme("ace/theme/chrome");
        }
    };
});

const codeId = document.getElementById('select-code');
const notification = document.getElementById('notification');
codeId.addEventListener('click', () => {
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = codeId.innerText;
    document.body.appendChild(tempTextarea);

    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999);

    document.execCommand('copy');
    document.body.removeChild(tempTextarea);

    notification.style.display = 'block';
    notification.style.opacity = 1;
    
    setTimeout(() => {
        notification.style.transition = 'opacity 1s';
        notification.style.opacity = 0;
        setTimeout(() => {
            notification.style.display = 'none';
        }, 1000);
    }, 1000);
});