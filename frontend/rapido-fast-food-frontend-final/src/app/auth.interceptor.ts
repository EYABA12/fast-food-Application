import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 // 1. On récupère le token stocké (nommé 'token')
  const myToken = localStorage.getItem('token');

  // 2. Si le token existe, on clone la requête pour lui ajouter le Header Authorization
  if (myToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${myToken}`
      }
    });
    return next(clonedRequest); // On envoie la requête avec le token
  }

  // 3. Sinon, on envoie la requête normale (sans token)
  return next(req);
};