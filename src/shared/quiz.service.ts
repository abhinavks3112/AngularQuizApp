import { Injectable } from '@angular/core';
import { IParticipant } from '../app/IParticipant';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class QuizService{
    baseUrl = "";
    constructor(private httpClient: HttpClient){
    }

    private handleError(errorResponse: HttpErrorResponse){
        if(errorResponse.error instanceof ErrorEvent){
        console.error('Client Side error: ', errorResponse.error.message);
        }
        else{
            console.error('Server side error: ', errorResponse )
        }
        return throwError('There is a problem with the service. It has been notified and we are working on it. Please try again later');
    }

    addParticipant(participant: IParticipant): Observable<IParticipant>{
        return this.httpClient.post<IParticipant>(this.baseUrl, participant, {
            headers: new HttpHeaders({
                'Content-Type':'application/json'
            })
        }).pipe(catchError(this.handleError));
    }
}