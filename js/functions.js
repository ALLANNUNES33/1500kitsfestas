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
