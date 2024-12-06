const video = document.querySelector('#framevideo');
video.currentTime = 3;
const container = document.querySelector('#container');
// Video set display size
if(window.matchMedia("(max-width: 767px)").matches) {
    // change style left
    video.style.left = '-50vw';
    video.width = window.innerWidth * 2;
    video.height = window.innerHeight;
} else {
    video.width = window.innerWidth;
    video.height = window.innerHeight;
}
let interactions = 0;
// pouse video on its second 14
video.addEventListener('timeupdate', function(e) {
    e.preventDefault();
    if (video.currentTime >= 14.2 && interactions === 0) {
        video.pause();
        changeSlide();
        interactions++;
    } else if(video.currentTime >= 29.5 && video.currentTime < 48 && interactions === 1) {
        video.pause();
        interactions = 1;
        changeSlide();
        interactions++;
    } else if (video.currentTime >= 54.5 && interactions === 1) {
        video.pause();
        interactions = 2;
        changeSlide();
    }
});

const cuteTexts = [
    `<div class="slider_caption">
        <span class="span-medieval">¡Hola! me alegro de verte. Parece que te han enviado la invitación para el cumpleaños de Sofi 👀
        eso signinfica que eres una persona importante y especial para ella 🥰<br><br>
        La fiesta será el día 4 de enero a las 5:00pm en la dirección<br>
        <a href="https://maps.app.goo.gl/fCu4U66y1sVXphgn8">Av. Girasol 1, Las Huertas 1ra Secc, 53427 Naucalpan de Juárez, Méx.</a><br>
        Nota: Si puedes traer un regalo 🎁 eso le encantaría, por favor no faltes</span>
        <div class="btn-container">
            <button id="si" >¿Confirmas asistencia?</button>
            <button id="no" >No, gracias</button>
        </div>
    </div>`,
    `<div class="slider_caption">
    <span class="span-medieval">¡Qué maravillosa noticia! estamos encantados de poder verte para el cumpleaños de Sofi<br><br>
    Por favor ayúdanos a confirmar tu asistencia añadiendo tus datos en el siguiente formulario. 😊
    </span>
    <form id="inviteForm">
        <input class="pap-input" type="text" placeholder="Nombre" id="nombre" required />
        <input class="pap-input" type="tel" placeholder="Teléfono" id="telefono" required />
        <input class="pap-input" type="number" placeholder="Acompañantes (0 si no)" id="acompanantes" required />
        <button class="pap-btn" id="enviar" >Enviar</button>
    </form></div>`,
    `<div class="slider_caption">
    <sapn class="span-medieval">
        Entiendo, es triste no poder verte ahí ese día... 😢<br><br><br>
        pero si cambias de opinión puedes confirmar tu asistencia
        usando el mismo enlace de antes.
    </span>
    </div>`,
    `<div class="slider_caption">
    <sapn class="span-medieval">
        ¡Gracias por confirmar tu asistencia, esperamos verte en la fiesta!<br><br>🎉🥳🎆🎊
    </span>
    </div>`,
]

function changeSlide () {
    const sliderArea = document.createElement('div');
    sliderArea.innerHTML = cuteTexts[interactions];
    sliderArea.className = `slider-area animate__animated animate__fadeIn animate__delay-2s`;

    container.appendChild( sliderArea );

    if (interactions === 0) {
        addFirstListenerButtons();
    } else if (interactions === 1) {
        addFormListener();
    }

}

function addFirstListenerButtons () {
    const buttonSi = document.querySelector('#si');
    const buttonNo = document.querySelector('#no');
    buttonSi.addEventListener( 'click', (e) => {
        e.preventDefault();
        video.play();
        video.currentTime = 26;
        container.removeChild( document.querySelector('.slider-area') );
    })

    buttonNo.addEventListener( 'click', (e) => {
        e.preventDefault();
        container.removeChild( document.querySelector('.slider-area') );
        video.currentTime = 48;
        video.play();
    })
}

function addFormListener() {
    const url = "https://9fgcaoptb3.execute-api.us-west-1.amazonaws.com/Prod"
    const btnSubmit = document.querySelector('#enviar');
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        try {
            document.querySelector('#inviteForm').removeChild( document.querySelector('.error-form') );
        } catch( err ) {}
        const nombre = document.querySelector('#nombre').value;
        const telefono = document.querySelector('#telefono').value;
        const acompanantes = document.querySelector('#acompanantes').value;

        if( !nombre || !telefono || !acompanantes ) {
            const errorMessage = document.createElement('span');
            errorMessage.innerHTML = `Por favor llene todos los campos`;
            errorMessage.className = `message-form text-danger`;
            document.querySelector('#inviteForm').appendChild(errorMessage)
            return;
        }

        btnSubmit.innerText = `Gracias!`
        btnSubmit.classList.remove('pap-btn');
        btnSubmit.classList.add('btn');
        btnSubmit.classList.add('btn-success');
        btnSubmit.disabled = true

        const successMessage = document.createElement('span');
        successMessage.innerHTML = `Estamos registrando sus datos`;
        successMessage.className = `message-form text-success`;
        document.querySelector('#inviteForm').appendChild(successMessage);
        fetch(url + '/add-guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nombre, phone: telefono, companions: acompanantes})
        }).then( res => {
            if(res.ok) {                
                setTimeout(() =>{
                    const sliderArea = document.querySelector('.slider-area')
                    container.removeChild( sliderArea );
                    sliderArea.innerHTML = cuteTexts[3];
                    sliderArea.className = `slider-area animate__animated animate__fadeIn animate__delay-2s`;
                    container.appendChild( sliderArea );
                },500);
            }
        }).catch( err => {
            console.log(err);
            successMessage.innerHTML = `Hubo un error, por favor intenta de nuevo`;
            successMessage.classList.remove('text-success');
            successMessage.classList.add('text-danger');
        });
    })
}