// Sistema de Gestión de Entradas con NFC
class SistemaEntradas {
    constructor() {
        this.entradas = this.cargarEntradas();
        this.escanerActivo = false;
        this.ultimoNfcId = null;
        this.inicializar();
    }

    inicializar() {
        this.configurarNavegacion();
        this.configurarFormularios();
        this.configurarEscaner();
        this.configurarImportacionExportacion();
        this.configurarBusqueda();
        this.actualizarListaEntradas();
        this.verificarCompatibilidadNFC();
    }

    // Navegación entre pestañas
    configurarNavegacion() {
        const tabs = ['nueva', 'escanear', 'lista'];
        
        tabs.forEach(tab => {
            document.getElementById(`tab-${tab}`).addEventListener('click', () => {
                this.cambiarTab(tab);
            });
        });
    }

    cambiarTab(tabActivo) {
        // Ocultar todas las secciones
        ['nueva', 'escanear', 'lista'].forEach(tab => {
            document.getElementById(`section-${tab}`).classList.add('hidden');
            document.getElementById(`tab-${tab}`).classList.remove('border-blue-500', 'text-blue-600');
            document.getElementById(`tab-${tab}`).classList.add('border-transparent', 'text-gray-600');
        });

        // Mostrar sección activa
        document.getElementById(`section-${tabActivo}`).classList.remove('hidden');
        document.getElementById(`tab-${tabActivo}`).classList.add('border-blue-500', 'text-blue-600');
        document.getElementById(`tab-${tabActivo}`).classList.remove('border-transparent', 'text-gray-600');

        // Si se cambia a escanear, detener escáner activo
        if (tabActivo !== 'escanear' && this.escanerActivo) {
            this.detenerEscaner();
        }
    }

    // Configuración de formularios
    configurarFormularios() {
        // Formulario de nueva entrada
        document.getElementById('form-entrada').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarEntrada();
        });

        // Botón de escanear NFC en formulario
        document.getElementById('btn-escanear-nfc').addEventListener('click', () => {
            this.escanearNFCFormulario();
        });

        // Formulario de edición
        document.getElementById('form-editar').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarEdicion();
        });

        // Botón cancelar edición
        document.getElementById('btn-cancelar-editar').addEventListener('click', () => {
            this.cerrarModalEditar();
        });
    }

    // Funcionalidad NFC
    verificarCompatibilidadNFC() {
        if ('NDEFReader' in window) {
            console.log('NFC compatible detectado');
        } else {
            console.log('NFC no compatible - usando modo simulación');
            this.mostrarNotificacion('NFC no compatible. Usando modo simulación para pruebas.', 'warning');
        }
    }

    async escanearNFCFormulario() {
        try {
            if ('NDEFReader' in window) {
                const ndef = new NDEFReader();
                await ndef.scan();
                
                ndef.addEventListener("reading", ({ message, serialNumber }) => {
                    document.getElementById('nfc-id').value = serialNumber;
                    this.ultimoNfcId = serialNumber;
                    this.mostrarNotificacion('NFC escaneado correctamente', 'success');
                });

                ndef.addEventListener("readingerror", () => {
                    this.mostrarNotificacion('Error al leer NFC', 'error');
                });

                this.mostrarNotificacion('Acerca el chip NFC al dispositivo', 'info');
            } else {
                // Modo simulación para desarrollo
                const nfcSimulado = 'NFC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                document.getElementById('nfc-id').value = nfcSimulado;
                this.ultimoNfcId = nfcSimulado;
                this.mostrarNotificacion('NFC simulado generado (modo desarrollo)', 'info');
            }
        } catch (error) {
            console.error('Error al escanear NFC:', error);
            this.mostrarNotificacion('Error al iniciar escáner NFC', 'error');
        }
    }

    // Configuración del escáner de entradas
    configurarEscaner() {
        document.getElementById('btn-iniciar-escanear').addEventListener('click', () => {
            this.iniciarEscaner();
        });

        document.getElementById('btn-detener-escanear').addEventListener('click', () => {
            this.detenerEscaner();
        });
    }

    async iniciarEscaner() {
        try {
            if ('NDEFReader' in window) {
                const ndef = new NDEFReader();
                await ndef.scan();
                
                ndef.addEventListener("reading", ({ message, serialNumber }) => {
                    this.verificarEntrada(serialNumber);
                });

                ndef.addEventListener("readingerror", () => {
                    this.mostrarNotificacion('Error al leer NFC', 'error');
                });

                this.escanerActivo = true;
                this.actualizarEstadoEscaner(true);
                this.mostrarNotificacion('Escáner activo - Acerca chips NFC', 'success');
            } else {
                // Modo simulación
                this.escanerActivo = true;
                this.actualizarEstadoEscaner(true);
                this.mostrarNotificacion('Escáner simulado activo (modo desarrollo)', 'info');
                
                // Simular lectura después de 3 segundos
                setTimeout(() => {
                    if (this.escanerActivo) {
                        const nfcSimulado = 'NFC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        this.verificarEntrada(nfcSimulado);
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('Error al iniciar escáner:', error);
            this.mostrarNotificacion('Error al iniciar escáner', 'error');
        }
    }

    detenerEscaner() {
        this.escanerActivo = false;
        this.actualizarEstadoEscaner(false);
        this.ocultarResultadoEscaner();
        this.mostrarNotificacion('Escáner detenido', 'info');
    }

    actualizarEstadoEscaner(activo) {
        const btnIniciar = document.getElementById('btn-iniciar-escanear');
        const btnDetener = document.getElementById('btn-detener-escanear');
        const estado = document.getElementById('estado-escanear');

        if (activo) {
            btnIniciar.classList.add('hidden');
            btnDetener.classList.remove('hidden');
            estado.innerHTML = `
                <i class="fas fa-wifi text-4xl text-blue-500 mb-2 animate-pulse"></i>
                <p class="text-blue-600 font-medium">Escáner activo</p>
                <p class="text-sm text-gray-500">Acerca un chip NFC</p>
            `;
        } else {
            btnIniciar.classList.remove('hidden');
            btnDetener.classList.add('hidden');
            estado.innerHTML = `
                <i class="fas fa-wifi text-4xl text-gray-400 mb-2"></i>
                <p class="text-gray-600">Presione el botón para iniciar el escáner</p>
            `;
        }
    }

    verificarEntrada(nfcId) {
        const entrada = this.entradas.find(e => e.nfcId === nfcId);
        
        if (entrada) {
            // Entrada válida
            this.reproducirSonido('ok');
            this.mostrarResultadoEscaner(true, entrada);
            this.mostrarNotificacion(`Entrada válida: ${entrada.nombre}`, 'success');
        } else {
            // Entrada no válida
            this.reproducirSonido('not');
            this.mostrarResultadoEscaner(false);
            this.mostrarNotificacion('Entrada no válida', 'error');
        }

        // Ocultar resultado después de 5 segundos
        setTimeout(() => {
            this.ocultarResultadoEscaner();
        }, 5000);
    }

    mostrarResultadoEscaner(exito, entrada = null) {
        const resultado = document.getElementById('resultado-escanear');
        const exitoDiv = document.getElementById('resultado-exito');
        const errorDiv = document.getElementById('resultado-error');

        resultado.classList.remove('hidden');

        if (exito && entrada) {
            exitoDiv.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            document.getElementById('nombre-escanear').textContent = `Nombre: ${entrada.nombre}`;
            document.getElementById('telefono-escanear').textContent = `Teléfono: ${entrada.telefono}`;
        } else {
            exitoDiv.classList.add('hidden');
            errorDiv.classList.remove('hidden');
        }
    }

    ocultarResultadoEscaner() {
        document.getElementById('resultado-escanear').classList.add('hidden');
        document.getElementById('resultado-exito').classList.add('hidden');
        document.getElementById('resultado-error').classList.add('hidden');
    }

    // Gestión de entradas
    guardarEntrada() {
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const nfcId = document.getElementById('nfc-id').value.trim();

        if (!nombre || !telefono || !nfcId) {
            this.mostrarNotificacion('Por favor complete todos los campos', 'error');
            return;
        }

        // Verificar si ya existe una entrada con ese NFC ID
        if (this.entradas.some(e => e.nfcId === nfcId)) {
            this.mostrarNotificacion('Ya existe una entrada con ese ID NFC', 'error');
            return;
        }

        const nuevaEntrada = {
            id: Date.now().toString(),
            nombre,
            telefono,
            nfcId,
            fechaCreacion: new Date().toISOString()
        };

        this.entradas.push(nuevaEntrada);
        this.guardarEntradas();
        this.limpiarFormulario();
        this.actualizarListaEntradas();
        this.mostrarNotificacion('Entrada guardada correctamente', 'success');
    }

    limpiarFormulario() {
        document.getElementById('form-entrada').reset();
        document.getElementById('nfc-id').value = '';
        this.ultimoNfcId = null;
    }

    editarEntrada(id) {
        const entrada = this.entradas.find(e => e.id === id);
        if (!entrada) return;

        document.getElementById('edit-id').value = entrada.id;
        document.getElementById('edit-nombre').value = entrada.nombre;
        document.getElementById('edit-telefono').value = entrada.telefono;
        document.getElementById('edit-nfc').value = entrada.nfcId;

        document.getElementById('modal-editar').classList.remove('hidden');
    }

    guardarEdicion() {
        const id = document.getElementById('edit-id').value;
        const nombre = document.getElementById('edit-nombre').value.trim();
        const telefono = document.getElementById('edit-telefono').value.trim();
        const nfcId = document.getElementById('edit-nfc').value.trim();

        if (!nombre || !telefono || !nfcId) {
            this.mostrarNotificacion('Por favor complete todos los campos', 'error');
            return;
        }

        // Verificar si el NFC ID ya existe en otra entrada
        const entradaExistente = this.entradas.find(e => e.nfcId === nfcId && e.id !== id);
        if (entradaExistente) {
            this.mostrarNotificacion('Ya existe otra entrada con ese ID NFC', 'error');
            return;
        }

        const entrada = this.entradas.find(e => e.id === id);
        if (entrada) {
            entrada.nombre = nombre;
            entrada.telefono = telefono;
            entrada.nfcId = nfcId;
            entrada.fechaModificacion = new Date().toISOString();

            this.guardarEntradas();
            this.actualizarListaEntradas();
            this.cerrarModalEditar();
            this.mostrarNotificacion('Entrada actualizada correctamente', 'success');
        }
    }

    cerrarModalEditar() {
        document.getElementById('modal-editar').classList.add('hidden');
        document.getElementById('form-editar').reset();
    }

    eliminarEntrada(id) {
        if (confirm('¿Está seguro de que desea eliminar esta entrada?')) {
            this.entradas = this.entradas.filter(e => e.id !== id);
            this.guardarEntradas();
            this.actualizarListaEntradas();
            this.mostrarNotificacion('Entrada eliminada correctamente', 'success');
        }
    }

    // Lista de entradas
    actualizarListaEntradas() {
        const contenedor = document.getElementById('lista-entradas');
        const sinEntradas = document.getElementById('sin-entradas');

        if (this.entradas.length === 0) {
            contenedor.classList.add('hidden');
            sinEntradas.classList.remove('hidden');
            return;
        }

        contenedor.classList.remove('hidden');
        sinEntradas.classList.add('hidden');

        contenedor.innerHTML = this.entradas.map(entrada => `
            <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">${entrada.nombre}</h3>
                        <p class="text-gray-600 text-sm">📱 ${entrada.telefono}</p>
                        <p class="text-gray-500 text-xs">🆔 ${entrada.nfcId}</p>
                        <p class="text-gray-400 text-xs">📅 ${new Date(entrada.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="sistema.editarEntrada('${entrada.id}')" 
                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="sistema.eliminarEntrada('${entrada.id}')" 
                                class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Búsqueda
    configurarBusqueda() {
        document.getElementById('buscar-entrada').addEventListener('input', (e) => {
            const busqueda = e.target.value.toLowerCase();
            this.filtrarEntradas(busqueda);
        });
    }

    filtrarEntradas(busqueda) {
        const entradasFiltradas = busqueda 
            ? this.entradas.filter(e => 
                e.nombre.toLowerCase().includes(busqueda) || 
                e.telefono.includes(busqueda) ||
                e.nfcId.toLowerCase().includes(busqueda)
              )
            : this.entradas;

        const contenedor = document.getElementById('lista-entradas');
        const sinEntradas = document.getElementById('sin-entradas');

        if (entradasFiltradas.length === 0) {
            contenedor.classList.add('hidden');
            sinEntradas.classList.remove('hidden');
            sinEntradas.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-search text-4xl mb-2"></i>
                    <p>No se encontraron entradas</p>
                </div>
            `;
            return;
        }

        contenedor.classList.remove('hidden');
        sinEntradas.classList.add('hidden');

        contenedor.innerHTML = entradasFiltradas.map(entrada => `
            <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">${entrada.nombre}</h3>
                        <p class="text-gray-600 text-sm">📱 ${entrada.telefono}</p>
                        <p class="text-gray-500 text-xs">🆔 ${entrada.nfcId}</p>
                        <p class="text-gray-400 text-xs">📅 ${new Date(entrada.fechaCreacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="sistema.editarEntrada('${entrada.id}')" 
                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="sistema.eliminarEntrada('${entrada.id}')" 
                                class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Importación y exportación CSV
    configurarImportacionExportacion() {
        document.getElementById('btn-importar').addEventListener('click', () => {
            document.getElementById('input-importar').click();
        });

        document.getElementById('input-importar').addEventListener('change', (e) => {
            this.importarCSV(e.target.files[0]);
        });

        document.getElementById('btn-exportar').addEventListener('click', () => {
            this.exportarCSV();
        });
    }

    importarCSV(archivo) {
        if (!archivo) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const contenido = e.target.result;
                const lineas = contenido.split('\n');
                const nuevasEntradas = [];

                // Saltar la primera línea (encabezados)
                for (let i = 1; i < lineas.length; i++) {
                    const linea = lineas[i].trim();
                    if (!linea) continue;

                    const campos = linea.split(',');
                    if (campos.length >= 3) {
                        const nuevaEntrada = {
                            id: Date.now().toString() + '_' + i,
                            nombre: campos[0].trim(),
                            telefono: campos[1].trim(),
                            nfcId: campos[2].trim(),
                            fechaCreacion: new Date().toISOString()
                        };

                        // Verificar que no exista duplicado
                        if (!this.entradas.some(e => e.nfcId === nuevaEntrada.nfcId)) {
                            nuevasEntradas.push(nuevaEntrada);
                        }
                    }
                }

                if (nuevasEntradas.length > 0) {
                    this.entradas.push(...nuevasEntradas);
                    this.guardarEntradas();
                    this.actualizarListaEntradas();
                    this.mostrarNotificacion(`${nuevasEntradas.length} entradas importadas correctamente`, 'success');
                } else {
                    this.mostrarNotificacion('No se pudieron importar entradas', 'warning');
                }

                // Limpiar input
                document.getElementById('input-importar').value = '';
            } catch (error) {
                console.error('Error al importar CSV:', error);
                this.mostrarNotificacion('Error al importar el archivo CSV', 'error');
            }
        };

        reader.readAsText(archivo);
    }

    exportarCSV() {
        if (this.entradas.length === 0) {
            this.mostrarNotificacion('No hay entradas para exportar', 'warning');
            return;
        }

        const encabezados = ['Nombre', 'Teléfono', 'ID NFC', 'Fecha Creación'];
        const datos = this.entradas.map(e => [
            e.nombre,
            e.telefono,
            e.nfcId,
            new Date(e.fechaCreacion).toLocaleDateString('es-ES')
        ]);

        const csv = [encabezados.join(','), ...datos.map(fila => fila.join(','))].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `entradas_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.mostrarNotificacion('CSV exportado correctamente', 'success');
    }

    // Persistencia de datos
    guardarEntradas() {
        localStorage.setItem('sistemaEntradas', JSON.stringify(this.entradas));
    }

    cargarEntradas() {
        const guardado = localStorage.getItem('sistemaEntradas');
        return guardado ? JSON.parse(guardado) : [];
    }

    // Utilidades
    reproducirSonido(tipo) {
        const audio = document.getElementById(`audio-${tipo}`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Error al reproducir audio:', e));
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transform transition-all duration-300 translate-x-full`;
        
        const colores = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };

        notificacion.className += ` ${colores[tipo]}`;
        notificacion.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${mensaje}</span>
            </div>
        `;

        document.body.appendChild(notificacion);

        // Mostrar notificación
        setTimeout(() => {
            notificacion.classList.remove('translate-x-full');
        }, 100);

        // Ocultar y eliminar después de 3 segundos
        setTimeout(() => {
            notificacion.classList.add('translate-x-full');
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }
}

// Inicializar la aplicación cuando se cargue la página
let sistema;
document.addEventListener('DOMContentLoaded', () => {
    sistema = new SistemaEntradas();
});

// Función global para acceder desde HTML
window.sistema = null; 