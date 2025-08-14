# 🎫 Sistema de Gestión de Entradas con NFC

Una aplicación web completa para gestionar entradas de eventos utilizando tecnología NFC, optimizada para dispositivos móviles.

## ✨ Características Principales

### 📱 **Interfaz Optimizada para Móviles**
- Diseño responsive con Tailwind CSS
- Navegación por pestañas intuitiva
- Interfaz táctil optimizada

### 🆔 **Gestión de Entradas**
- **Crear nuevas entradas**: Nombre, teléfono y escaneo NFC
- **Editar entradas existentes**: Modificar datos y números de serie NFC
- **Eliminar entradas**: Gestión completa del inventario
- **Búsqueda en tiempo real**: Filtrar por nombre, teléfono o ID NFC

### 📡 **Funcionalidad NFC**
- **Escaneo de chips NFC** para registro de entradas
- **Verificación de entradas** el día del evento
- **Compatibilidad automática** con dispositivos NFC
- **Modo simulación** para desarrollo y pruebas

### 🔊 **Sistema de Audio**
- **Sonido de éxito** (`ok.mp3`) para entradas válidas
- **Sonido de error** (`not.mp3`) para entradas no válidas
- **Notificaciones visuales** con iconos y colores

### 📊 **Importación y Exportación**
- **Importar CSV**: Cargar listas de espectadores desde archivos
- **Exportar CSV**: Descargar datos en formato estándar
- **Validación de duplicados** automática

### 💾 **Persistencia de Datos**
- **Almacenamiento local** en el navegador
- **Datos persistentes** entre sesiones
- **Backup automático** de toda la información

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Dispositivo con NFC (para funcionalidad completa)
- Los archivos de audio `ok.mp3` y `not.mp3` en la misma carpeta

### Instalación
1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador
3. Para funcionalidad NFC completa, accede desde Chrome en Android

### Uso Básico

#### 1. **Crear Nueva Entrada**
- Ve a la pestaña "Nueva Entrada"
- Completa nombre y teléfono
- Presiona "Escanear" y acerca el chip NFC
- Presiona "Guardar Entrada"

#### 2. **Escanear Entradas (Día del Evento)**
- Ve a la pestaña "Escanear"
- Presiona "Iniciar Escáner"
- Acerca chips NFC al dispositivo
- Verifica resultados en pantalla

#### 3. **Gestionar Entradas**
- Ve a la pestaña "Lista"
- Busca entradas específicas
- Edita o elimina según necesites
- Importa/exporta datos CSV

## 🔧 Funcionalidades Técnicas

### **Compatibilidad NFC**
- **Web NFC API** para dispositivos compatibles
- **Modo simulación** para desarrollo
- **Detección automática** de capacidades

### **Gestión de Estado**
- **Patrón Observer** para actualizaciones en tiempo real
- **Validación de datos** en formularios
- **Manejo de errores** robusto

### **Persistencia**
- **localStorage** para datos del navegador
- **JSON** para estructura de datos
- **Backup automático** en cada operación

## 📱 Optimizaciones para Móviles

### **Interfaz Responsive**
- Diseño adaptativo para todas las pantallas
- Botones táctiles optimizados
- Navegación por gestos

### **Performance**
- Carga rápida de la aplicación
- Búsqueda en tiempo real
- Animaciones suaves

### **Accesibilidad**
- Iconos descriptivos
- Colores contrastantes
- Texto legible en móviles

## 🎯 Casos de Uso

### **Antes del Evento**
1. Crear entradas para cada espectador
2. Escanear chips NFC individuales
3. Importar listas desde CSV
4. Verificar y editar datos

### **Durante el Evento**
1. Activar modo escáner
2. Escanear entradas de espectadores
3. Verificar validez en tiempo real
4. Reproducir sonidos de confirmación

### **Después del Evento**
1. Exportar datos de asistencia
2. Generar reportes CSV
3. Mantener historial de entradas

## 🔒 Seguridad y Privacidad

### **Datos Locales**
- Toda la información se almacena localmente
- No se envían datos a servidores externos
- Privacidad completa del usuario

### **Validación**
- Verificación de duplicados NFC
- Validación de formularios
- Prevención de entradas duplicadas

## 🛠️ Personalización

### **Sonidos**
- Reemplaza `ok.mp3` y `not.mp3` con tus propios archivos
- Formatos soportados: MP3, WAV, OGG

### **Estilos**
- Modifica `index.html` para cambiar colores
- Personaliza con Tailwind CSS
- Ajusta iconos de Font Awesome

### **Funcionalidades**
- Extiende la clase `SistemaEntradas`
- Añade nuevos campos de datos
- Implementa validaciones adicionales

## 📋 Estructura de Archivos

```
📁 Sistema de Entradas/
├── 📄 index.html          # Interfaz principal
├── 📄 app.js             # Lógica de la aplicación
├── 📄 README.md          # Documentación
├── 🔊 ok.mp3             # Sonido de éxito
├── 🔊 not.mp3            # Sonido de error
└── 📄 promt.txt          # Especificaciones originales
```

## 🚨 Solución de Problemas

### **NFC No Funciona**
- Verifica que tu dispositivo tenga NFC
- Usa Chrome en Android para mejor compatibilidad
- La aplicación funciona en modo simulación sin NFC

### **Sonidos No Se Reproducen**
- Verifica que los archivos MP3 estén en la carpeta
- Asegúrate de que el navegador permita audio
- Prueba en modo incógnito

### **Datos No Se Guardan**
- Verifica que localStorage esté habilitado
- Limpia caché del navegador
- Prueba en otro navegador

## 🔮 Futuras Mejoras

- [ ] **Sincronización en la nube**
- [ ] **Múltiples eventos**
- [ ] **Estadísticas y reportes**
- [ ] **Modo offline completo**
- [ ] **API REST para integración**
- [ ] **Notificaciones push**

## 📞 Soporte

Para soporte técnico o sugerencias:
- Revisa la consola del navegador para errores
- Verifica la compatibilidad de tu dispositivo
- Consulta la documentación de Web NFC API

---

**Desarrollado con ❤️ para la gestión eficiente de eventos**

*Esta aplicación utiliza tecnologías web modernas y está optimizada para dispositivos móviles con NFC.* 