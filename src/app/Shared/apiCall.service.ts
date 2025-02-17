import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, shareReplay, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GlobalService } from '../Global/Service/global.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
  private static cache: { [url: string]: any } = {};
  static clearCache() {
    this.cache = {};
  }
  constructor(
    private globalService: GlobalService,
    private location: Location,
    private router: Router
  ) {}
  private static playAudio(type: string): void {
    const audio = new Audio(this.getAudioUrl(type));
    audio.play();
  }
  private static getAudioUrl(type: string): string {
    return (
      window.location.origin +
      `/assets/Audio/${type === 'D' ? 'Error-Notification' : 'Popup'}.mp3`
    );
  }
  public static ToastTrigger(
    message: string | undefined,
    S: string | undefined
  ) {
    if (S?.toString() === '200') {
      this.playAudio('S');
      S = 'bg-success';
    } else if (S?.toString() === 'P') {
      S = 'bg-primary';
    } else if (S?.toString() === '300') {
      S = 'bg-danger';
      this.playAudio('D');
    } else if (S?.toString() === 'W') {
      S = 'bg-warning';
    } else if (S === 'I') {
      var lblToastHeading = document.getElementById('lblToastHeading');
      if (lblToastHeading) {
        lblToastHeading.classList.add('bg-info');
      }
    }

    var ID = 'ToastRandom' + Math.floor(Math.random() * 100000 + 1);
    var ToastBody = this.ToastHtml(S, ID, message);
    var LayoutToastcontainer = document.getElementById('LayoutToastcontainer');
    if (LayoutToastcontainer) {
      LayoutToastcontainer.insertAdjacentHTML('beforeend', ToastBody);
      var toastElement = document.getElementById(ID);
      if (toastElement) {
        toastElement.classList.add('show');
        setTimeout(function () {
          toastElement?.remove();
        }, 5000);
      }
    }
  }
  public static ToastHtml(
    sClass: string | undefined,
    ID: string | undefined,
    Message: string | undefined
  ): string {
    return (
      '<div class="toast align-items-center text-white ' +
      sClass +
      ' border-0" role="alert" aria-live="assertive" aria-atomic="true" id=' +
      ID +
      '>' +
      '<div class="d-flex"><div class="toast-body"><label>' +
      Message +
      '</label></div>' +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>'
    );
  }
  public static Post(
    http: HttpClient,
    url: string,
    parameter: any
  ): Observable<Response> {
    let body = parameter;
    return http.post<Response>(url, body).pipe(
      tap((response: Response) => {
        if (response.message != '' && response.status != '')
          this.ToastTrigger(response.message, response.status);
      })
    );
  }
  public static PostwithAuth(
    http: HttpClient,
    url: string,
    parameter: any,
    area: string,
    cached: boolean
  ): Observable<Response> {
    let body = parameter;
    let token = this.GetToken(area);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    if (this.cache[url] && cached) {
      return of(this.cache[url]); // Return cached data as an Observable
    }
    return http.post<Response>(url, body, { headers }).pipe(
      shareReplay(1),
      tap((response: Response) => {
        if (cached) {
          this.cache[url] = response;
        }
        if (
          response.message != '' &&
          response.message != null &&
          response.status != ''
        ) {
          this.ToastTrigger(response.message, response.status);
        }
      }),
      catchError((error: any) => {
        if (error.status === 401) {
          this.RemoveToken(area);
          // Handle unauthorized error, for example, redirect to login page
          //console.log('Unauthorized error occurred:', error);
          // You can also show a toast message or perform any other action
        }
        return throwError(() => error); // Rethrow the error to propagate it
      })
    );
  }
  public static GetToken(area: string): string | null {
    if (area == 'CMS') {
      const Storage = localStorage.getItem('CMSToken');
      if (Storage !== null) {
        // Parse the JSON string to an object
        return JSON.parse(Storage).token;
      }
    }
    return null;
  }
  public static RemoveToken(area: string) {
    if (area == 'CMS') {
      localStorage.removeItem('CMSToken');
    }
  }
  public static downloadFile(
    http: HttpClient,
    url: string,
    parameter: any,
    area: string
  ): Observable<HttpResponse<Blob>> {
    let body = parameter;
    let token = this.GetToken(area);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return http
      .post(url, body, { headers, observe: 'response', responseType: 'blob' })
      .pipe(
        tap((response: HttpResponse<Blob>) => {
          // Extract file name from the response headers
          let filename = response.headers.get('fileName') || 'downloadedFile';

          if (response.body) {
            // Create a blob URL and download the file
            const blobUrl = URL.createObjectURL(response.body);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename; // Use the extracted file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);

            // Trigger your toast message (if needed)
            // this.ToastTrigger('File downloaded successfully', 'success');
          } else {
            this.ToastTrigger('Download error: response body is null', '300');
            console.error();
          }

          // Trigger your toast message (if needed)
          // this.ToastTrigger('File downloaded successfully', 'success');
        }),
        catchError((error: any) => {
          if (error.status === 401) {
            this.RemoveToken(area);
            // Handle unauthorized error, for example, redirect to login page
            // You can also show a toast message or perform any other action
          }
          return throwError(() => error); // Rethrow the error to propagate it
        })
      );
  }
}
export class Response {
  public message?: string;
  public status?: string;
  public data: any;
}
