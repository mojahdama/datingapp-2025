import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, map, of, tap } from 'rxjs';
//this
const cache = new Map<string , HttpEvent<unknown>>();
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);


  const generateCacheKey = (url:string , params : HttpParams):string =>{
    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url
  }

  const cacheKey = generateCacheKey(req.url , req.params);

  if(req.method ==='GET'){
    const cachedReaponse = cache.get(cacheKey)
    if (cachedReaponse) {
      return of(cachedReaponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => {
      cache.set(cacheKey,response)
    }),
    finalize(() => {
      busyService.idle()
    })
  );
};
