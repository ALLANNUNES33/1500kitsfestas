
//TIMER
document.addEventListener('DOMContentLoaded', () => {

    var contador = 12 * 60;
    var intervalo = setInterval(function () {
        var minutos = Math.floor(contador / 60);
        var segundos = contador % 60;


        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;


        document.getElementById('timer').textContent = minutos + '   :      ' + segundos;

        contador--;


        if (contador < 0) {
            clearInterval(intervalo);
        }
    }, 1000);

});

// DATE NOW
let dataAtual = new Date();
let dataBotoes = document.querySelectorAll('.dataAtual');

dataBotoes.forEach((botao) => {
    botao.textContent = dataAtual.toLocaleDateString();
});


//ANIMATION PROGRESSO
var progressElement = document.querySelector('.progress');
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    } else {
      entry.target.classList.remove('active');
    }
  });
});
observer.observe(progressElement);


// Function Timer + Pix Expirado//
function timerSec(tempo, id) {
  let tempototal = tempo * 60; // Tempo inicial em segundos
  let contador = tempototal;
  let intervalo = setInterval(function () {
      let horas = Math.floor(contador / 3600); // Calcula as horas
      let minutos = Math.floor((contador % 3600) / 60); // Calcula os minutos restantes
      let segundos = contador % 60; // Calcula os segundos restantes
      // Adiciona um zero à esquerda se os minutos ou segundos forem menores que 10
      horas = horas < 10 ? '0' + horas : horas;
      minutos = minutos < 10 ? '0' + minutos : minutos;
      segundos = segundos < 10 ? '0' + segundos : segundos;
      // Atualiza o elemento HTML com o ID 'temporizador' com o tempo restante
      id.innerHTML =`${horas} : ${minutos} : ${segundos}`;
      contador--;
      // Se o contador chegar a zero, limpa o intervalo
      if (contador < 0) {
          clearInterval(intervalo);
      }
  }, 1000); // Executa a função a cada 1000 milissegundos (ou seja, 1 segundo)
}
