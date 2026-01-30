# Legado IA - Asistente Legal Inteligente

Plataforma de inteligencia artificial especializada en consultoría legal boliviana.

## 🚀 Características

- **Interfaz ChatGPT-like** elegante y profesional
- **Base de datos mockeada** con localStorage para persistencia de chats
- **Historial de conversaciones** organizado por fecha
- **Respuestas especializadas** en derecho boliviano:
  - Derecho Civil
  - Derecho Laboral  
  - Derecho Comercial
  - Derecho Penal
  - Derecho de Familia y Sucesiones
- **Diseño responsive** adaptado a todos los dispositivos
- **Ejemplos de consulta** para facilitar el inicio
- **Sistema de múltiples chats** independientes

## 🎨 Paleta de Colores

- **Primary**: #1a2332 (Azul marino profesional)
- **Accent**: #c9a961 (Dorado elegante)
- **Background**: #ffffff, #f7f8fa
- **Text**: #1a1a1a, #5f6368

## 📁 Estructura del Proyecto

```
legado/
├── index.html          # Estructura HTML
├── styles.css          # Estilos CSS personalizados
├── app.js              # Lógica de la aplicación
├── favicon.svg         # Icono del sitio
└── README.md           # Documentación
```

## 🛠️ Instalación y Uso

### Desarrollo Local

1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador
3. ¡Comienza a chatear!

No requiere instalación de dependencias ni build process.

### Deploy en Netlify

1. Crea una cuenta en [Netlify](https://netlify.com)
2. Arrastra la carpeta del proyecto a Netlify Drop
3. O conecta tu repositorio de GitHub
4. Netlify detectará automáticamente que es un sitio estático
5. Tu sitio estará disponible en `https://tu-sitio.netlify.app`

#### Configuración Netlify (opcional)

Crea un archivo `netlify.toml` en la raíz:

```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 💾 Base de Datos Simulada

La aplicación utiliza `localStorage` para simular una base de datos persistente:

- **Almacenamiento de chats**: Cada conversación se guarda con ID único
- **Historial organizado**: Chats separados por fecha (Hoy, Ayer, 7 días)
- **Persistencia**: Los datos permanecen entre sesiones
- **CRUD completo**: Crear, leer y eliminar chats

### Estructura de datos:

```javascript
{
  chats: [
    {
      id: 1,
      title: "Consulta sobre empresas",
      messages: [
        { role: "user", content: "..." },
        { role: "assistant", content: "..." }
      ],
      createdAt: "2026-01-29T...",
      updatedAt: "2026-01-29T..."
    }
  ],
  nextId: 2
}
```

## 🤖 Sistema de Respuestas

El sistema detecta palabras clave y proporciona respuestas especializadas:

- **Empresas**: Constitución, S.R.L., sociedades
- **Laboral**: Despidos, aguinaldo, indemnización
- **Contratos**: Arrendamiento, alquileres
- **Herencias**: Sucesiones, testamentos
- **Penal**: Delitos, procedimientos

## 📱 Responsive Design

- **Desktop**: Sidebar fija, chat centrado
- **Tablet**: Optimización de espacios
- **Mobile**: Sidebar colapsable, input optimizado

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Clases, async/await, localStorage
- **Sin frameworks**: Vanilla JavaScript puro

## 🎯 Funcionalidades Implementadas

✅ Sistema de chats múltiples
✅ Historial persistente
✅ Respuestas contextuales
✅ Animaciones suaves
✅ Indicador de escritura
✅ Textarea auto-expandible
✅ Ejemplos de consultas
✅ Sistema de navegación
✅ Diseño profesional legal
✅ Optimización móvil

## 🚀 Mejoras Futuras (Sugerencias)

- Integración con API real de IA
- Sistema de autenticación
- Exportar conversaciones a PDF
- Búsqueda en historial
- Categorización automática de consultas
- Citas legales con referencias
- Sistema de favoritos
- Modo oscuro
- Compartir conversaciones

## 📄 Licencia

Este proyecto es un demo/prototipo para Legado IA.

## 👥 Autor

Desarrollado para Legado IA - Plataforma de Inteligencia Artificial Legal Boliviana

---

**Nota**: Esta es una versión demo con datos mockeados. Para producción, se debe integrar con un backend real y servicios de IA especializados en derecho boliviano.
