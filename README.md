# Auth System App — Frontend (Angular 20)

Aplicación Angular para registrar y autenticar usuarios contra la Web API de
ASP.NET Core Identity + JWT (`Authentication.API`).

## Qué hace

| Paso | Implementación |
| --- | --- |
| Landing con nombre de la app y botones Registro / Login | `src/app/pages/landing/` |
| Modal de registro + aviso de éxito y regreso a la landing | `features/auth/register-form/` + `shared/modal/` + `shared/toast/` |
| Modal de login con validación de correo y contraseña | `features/auth/login-form/` |
| Página de usuario protegida (nombre, correo, JWT y roles) | `pages/usuario/` + `core/guards/auth.guard.ts` |
| Logout y regreso a la landing | `pages/usuario/usuario.ts` → `AuthService.logout()` |

## Estructura

```
src/app/
├── core/
│   ├── models/auth.models.ts          Contratos (DTOs) de la API
│   ├── services/auth.service.ts       Estado de sesión con signals + llamadas HTTP
│   ├── interceptors/auth.interceptor.ts  Agrega "Authorization: Bearer <token>"
│   └── guards/auth.guard.ts           Bloquea /usuario sin token válido
├── shared/
│   ├── modal/                         Modal accesible (Escape, foco, aria-modal)
│   └── toast/                         Avisos breves
├── features/auth/
│   ├── register-form/                 Reactive form con las reglas de Identity
│   └── login-form/                    Reactive form de acceso
└── pages/
    ├── landing/
    └── usuario/                       Ruta protegida
```

## Requisitos

- Node.js 20.19+ o 22.12+
- La API `Authentication.API` corriendo (ver `BACKEND-CAMBIOS.md`)

## Cómo correrlo

```bash
npm install
npm start          # http://localhost:4200
```

Antes de arrancar, ajusta la URL de la API en
`src/environments/environment.development.ts`. El puerto está en el
`Properties/launchSettings.json` de la API (perfil `https`):

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api',
};
```

Si el navegador rechaza el certificado de desarrollo:

```bash
dotnet dev-certs https --trust
```

## Decisiones técnicas

- **Componentes standalone y signals** (Angular 20). Sin NgModules.
- **El token vive en `localStorage`** y se rehidrata al recargar; el `AuthService`
  descarta tokens expirados leyendo el claim `exp`, así que recargar con un token
  vencido devuelve al usuario a la landing.
- **El guard es sólo de experiencia de usuario.** La autorización real la aplica
  la API con `[Authorize]`; el guard evita mostrar una pantalla que igual no
  tendría datos.
- **Las reglas de contraseña del formulario replican las de Identity**
  (`Program.cs`): 8 caracteres, mayúscula, minúscula, dígito y símbolo. Así el
  error se ve antes de gastar una llamada al servidor.
- **`/api/auth/logout` responde texto plano**, por eso se pide con
  `responseType: 'text'`.
