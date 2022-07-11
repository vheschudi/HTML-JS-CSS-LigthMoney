let spreed = 5;
let arrayMonedas = [];

class Moneda{
    constructor(id, simbolo, valor){
        this.id = id;
        this.simbolo = simbolo;
        this.valor = valor;
    }
}

//Función que construye una tabla de cotizaciones haciendo una solicitud fecht aun archivo json
//y volcando esos datos a una tabla
function requestJson(){

    let tabla = document.createElement("table");
    tabla.className = "table table-dark table-sm";
    let tablaBody = document.createElement("tbody");

    let fila = '';

    fetch("./prices.json")
    .then((res) => res.json())
    .then((data) => {
        let prices = data.prices;
        for(const moneda of prices){
            fila = document.createElement("tr");
            fila.innerHTML = `<td>${moneda.simbolo}</td><td>$${moneda.valor}</td>`;
            tablaBody.appendChild(fila);
        }

        arrayMonedas = [...prices];
    })

    renderTable(tabla, tablaBody);
}

//Función que renderíza la tabla de cotizaciones en el DOM
function renderTable(tabla, tablaBody){

    tabla.appendChild(tablaBody)

    let title = document.createElement("h4");
    title.className = "title-market-rates";
    title.innerText = "Market rates";

    let spreedText = document.createElement("p")
    spreedText.className = "spreed-Text";
    spreedText.innerText = `Spreed -${spreed}%`;

    lastQuote();

    exit.parentNode.insertBefore(tabla, exit.nextSibling);
    exit.parentNode.insertBefore(spreedText, exit.nextSibling);
    exit.parentNode.insertBefore(title, exit.nextSibling);
}

//Función que renderiza la ultima cotización obtenida, si hubiera alguna guardada en el localstorage
function lastQuote(){
    let exit = document.getElementById("exit");
    let paragraph = "";

    if(localStorage.getItem("prices") != null){
        let aux = localStorage.getItem("prices");
        let auxJson = JSON.parse(aux);
        paragraph = document.createElement("p");
        paragraph.id = "box-text";
        paragraph.className = "box-text";
        paragraph.innerText = `Last cuote: ${auxJson.time} \n ${auxJson.amount} ${auxJson.origin} -> ${auxJson.quote} ${auxJson.destiny}`
        exit.parentNode.insertBefore(paragraph, exit.nextSibling);
    }else{
        console.log("localstore empty")
    }
}

//Función que detecta si la app se esta ejecutando en un celular
//Según cual sea la devolución se utiliza determinado protocolo para enviar un mensaje por whatsapp
function isMobile(){

    if (sessionStorage.desktop)
        return false;
    else if (localStorage.mobile)
        return true;

    var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone'];
    for (var i in mobile)
        if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;
    return false;
}

function confirm(){

    let aux = localStorage.getItem("prices");
    let quote = JSON.parse(aux);

    //Uso de librería SweetAlert2
    const swalWithBootstrapButtons = Swal.mixin({
    
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
    swalWithBootstrapButtons.fire({
        title: 'Confirm the operation <strong>now</strong>',
        text: `${quote.amount} ${quote.origin} = ${quote.quote} ${quote.destiny}. This quote is valid until ${quote.time} hs.`,

        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, confirm!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((resul) => {
        if(resul.isConfirmed){
            
            //Envío de mensaje por whatsapp aceptando cotización
            const urlDesktop = 'https://web.whatsapp.com/';
            const urlMobile = 'whatsapp://';
            const phone = '2255408036';

            let message = `send?phone=${phone}&text=Hi, my name is ${quote.userName} and I'm interested in:%0A${quote.amount} ${quote.origin} = ${quote.quote} ${quote.destiny}%0AThis quote is valid until ${quote.time} hs.`

            if(isMobile()) window.open(urlMobile + message, '_blank');
                
            else window.open(urlDesktop + message, '_blank');
                
            swalWithBootstrapButtons.fire('Confirmed!', 'We will contact you soon.', 'success');
 
        }else{
            swalWithBootstrapButtons.fire('Cancelled', 'We are waiting for you soon :)', 'error');
        }
    }) 

}

export default requestJson;
export { spreed, arrayMonedas, lastQuote, confirm };