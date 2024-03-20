let estado = true;
let arreglo;
let totalMinas;
let filas;
let columnas;

function iniciarJuego() {
    const tamaño = prompt("Ingresa el tamaño del tablero (mínimo 5x5): (Formato: Filas x Columnas)", "10x10");
    const minas = parseInt(prompt("Ingresala cantidad de minas:", "10"));

    [filas, columnas] = tamaño.split('x').map(val => parseInt(val));
    
    if (isNaN(filas) || isNaN(columnas) || isNaN(minas) || filas < 5 || columnas < 5 || minas >= filas * columnas) {
        alert("Ingresa valores validos");
        return;
    }

    totalMinas = minas;
    arreglo = crearTablero(filas, columnas);
    disponerBombas(arreglo, totalMinas);
    generarBombasProximas(arreglo);

    crearPantalla();
}

function crearTablero(filas, columnas) {
    const arreglo = [];
    for (let f = 0; f < filas; f++) {
        arreglo.push([]);
        for (let c = 0; c < columnas; c++) {
            arreglo[f].push(0);
        }
    }
    return arreglo;
}

function disponerBombas(arreglo, totalMinas) {
    let cant = 0;
    do {
        const fila = Math.floor(Math.random() * filas);
        const columna = Math.floor(Math.random() * columnas);
        if (arreglo[fila][columna] == 0) {
            arreglo[fila][columna] = 'b';
            cant++;
        }
    } while (cant != totalMinas);
}

function contarLado(arreglo, fila, columna) {
    let total = 0;
    for (let i = fila - 1; i <= fila + 1; i++) {
        for (let j = columna - 1; j <= columna + 1; j++) {
            if (i >= 0 && i < filas && j >= 0 && j < columnas && arreglo[i][j] == 'b') {
                total++;
            }
        }
    }
    return total;
}

function generarBombasProximas(arreglo) {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (arreglo[f][c] == 0) {
                arreglo[f][c] = contarLado(arreglo, f, c);
            }
        }
    }
}

function crearPantalla() {
  let cad = '';
  const tamañoMinimo = Math.min(filas, columnas); // Determinar el lado más corto para formar un cuadrado
  for (let f = 0; f < tamañoMinimo; f++) {
      for (c = 0; c < tamañoMinimo; c++) {
          cad += `<span class="celda gris" id="celda${f}${c}" data-fila="${f}" data-columna="${c}"></span>`;
      }
  }
  document.querySelector(".contenedor").innerHTML = cad;
}

let primerTurno = true;

function destapar(arreglo, fila, columna, evento) {
    if (primerTurno && arreglo[fila][columna] === 'b') {
        iniciarJuego();
        return;
    }

    if (arreglo[fila][columna] === 'b') {
        evento.target.style.backgroundColor = 'red';
        setTimeout(() => alert('Perdiste'), 10);
        estado = false;
    } else {
        if (arreglo[fila][columna] >= 1 && arreglo[fila][columna] <= 8) {
            evento.target.textContent = arreglo[fila][columna];
            evento.target.classList.add('verde');
            evento.target.classList.remove('gris');
        } else {
            if (arreglo[fila][columna] === 0) {
                recorrer(arreglo, fila, columna);
                console.table(arreglo);
            }
        }
    }
    verificarGanado();
    primerTurno = false; // Después del primer turno, actualizar la variable
}

function verificarGanado() {
    const celdas = document.querySelectorAll(".contenedor span");
    let cant = 0;
    celdas.forEach(celda => {
        if (celda.classList.contains('verde')) {
            cant++;
        }
    });
    if (cant == filas * columnas - totalMinas) {
        estado = false;
        setTimeout(() => alert('Ganaste'), 10);
    }
}

function recorrer(arreglo, fil, col) {
    if (fil >= 0 && fil < filas && col >= 0 && col < columnas) {
        if (arreglo[fil][col] == 0) {
            arreglo[fil][col] = "x";
            document.querySelector(`#celda${fil}${col}`).classList.add('verde');
            document.querySelector(`#celda${fil}${col}`).classList.remove('gris');
            recorrer(arreglo, fil, col + 1);
            recorrer(arreglo, fil, col - 1);
            recorrer(arreglo, fil + 1, col);
            recorrer(arreglo, fil - 1, col);
            recorrer(arreglo, fil - 1, col - 1);
            recorrer(arreglo, fil - 1, col + 1);
            recorrer(arreglo, fil + 1, col + 1);
            recorrer(arreglo, fil + 1, col - 1);
        } else {
            if (arreglo[fil][col] >= 1 && arreglo[fil][col] <= 8) {
                document.querySelector(`#celda${fil}${col}`).classList.add('verde');
                document.querySelector(`#celda${fil}${col}`).classList.remove('gris');
                document.querySelector(`#celda${fil}${col}`).textContent = arreglo[fil][col];
            }
        }
    }
}

document.querySelector(".contenedor").addEventListener('click', evento => {
    if (evento.target.tagName == 'SPAN' && estado) {
        const fila = parseInt(evento.target.dataset.fila);
        const columna = parseInt(evento.target.dataset.columna);
        if (evento.shiftKey) { // Marcar con bandera
            marcarConBandera(evento.target);
        } else {
            if (document.querySelector(`#celda${fila}${columna}`).classList.contains('gris')) {
                destapar(arreglo, fila, columna, evento);
            }
        }
    }
});

function marcarConBandera(celda) {
    if (!celda.classList.contains('verde') && !celda.classList.contains('bandera')) {
        celda.classList.add('bandera');
        totalMinas--;
        if (totalMinas === 0) {
            verificarGanado();
        }
    } else if (celda.classList.contains('bandera')) {
        celda.classList.remove('bandera');
        totalMinas++;
    }
}

iniciarJuego();
