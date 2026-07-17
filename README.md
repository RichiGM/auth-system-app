# Auth System App — Frontend

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
- La API `Authentication.API` corriendo

Antes de arrancar, ajusta la URL de la API en
`src/environments/environment.development.ts`. El puerto está en el
`Properties/launchSettings.json` de la API (perfil `https`):

```ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api',
};
```
