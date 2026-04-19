document.addEventListener('DOMContentLoaded', () => {
    const menuBoton = document.getElementById('menuBtn');
    const navbar = document.querySelector('.navbar');


    menuBoton.addEventListener('click', () => {
        menuBoton.classList.toggle('open');
        navbar.classList.toggle('active');
    });
});
