import requestJson, {spreed, arrayMonedas, confirm} from "./functions.js"

class Price{
    constructor(time, origin, amount, destiny, quote, name, email){
        this.time = time;
        this.origin = origin;
        this.amount = amount;
        this.destiny = destiny;
        this.quote = quote;
        this.userName = name;
        this.userEmail = email;
    }
}

//Evento que renderiza tabla de cotizaciones según valores del objeto Date
window.onload = () => requestJson();

//El boton go! se personaliza con el nombre del usuario
let userName = document.getElementById("name");
userName.onchange = () => {
    
    let textButton = document.getElementById("btn-calculate-quote");
    textButton.innerText = `Come on ${userName.value}!`;
}

//Eventos del botón go!
let button = document.getElementById("btn-calculate-quote");

button.onclick = () => {

    let userName = document.getElementById("name");
    let userEmail = document.getElementById("email");
    let cantidad = document.getElementById("amount");

    //Validación del campo name
    if(userName.value == ""){
        const Toast = Swal.mixin({
            toast: true,
            position: 'centar',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: 'There goes a name'
          })
        userName.focus();
        return 0;
    }

    //Validación del campo email
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    if(userEmail.value == ""){
        const Toast = Swal.mixin({
            toast: true,
            position: 'centar',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: 'We need your email'
          })
        userEmail.focus();
        return 0;

    }else if(!emailRegex.test(userEmail.value)){
        const Toast = Swal.mixin({
            toast: true,
            position: 'centar',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: 'Please enter a valid email'
          })
        userEmail.focus();
        return 0;

    }

    //Validación del campo cantidad
    if(cantidad.value == ""){
        const Toast = Swal.mixin({
            toast: true,
            position: 'centar',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'error',
            title: 'We need how much money to change'
          })
        amount.focus();
        return 0;
    }
        
    let monedaOrigen = arrayMonedas[document.getElementById("origin").selectedIndex];
    let monedaDestino = arrayMonedas[document.getElementById("destiny").selectedIndex];
    const result = Math.round(((cantidad.value * monedaOrigen.valor) / monedaDestino.valor) * (100 - spreed)) / 100;

    //establece un límite de tiempo para concretar la operación
    let currentDate = new Date();
    let time = (new Date(currentDate.getTime() + 3600000)).toLocaleTimeString();

    //Guarda en el localstorage los datos de la operación
    let newQuote = new Price(time, monedaOrigen.simbolo, cantidad.value, monedaDestino.simbolo, result, userName.value, userEmail.value);
    localStorage.setItem("prices", JSON.stringify(newQuote));

    confirm();
}

//Función jQuery que controla boton ir al top
$(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
        $('a.scroll-top').fadeIn('slow');
    } else {
        $('a.scroll-top').fadeOut('slow');
    }
});
$('a.scroll-top').click(function(event) {
    event.preventDefault();
    $('html, body').animate({scrollTop: 0}, 600);
});
