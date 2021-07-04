import { Injectable } from '@angular/core';
import { IParticipant } from '../app/IParticipant';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { IQuestions } from 'src/app/IQuestions';
import { DropdownModel } from './dropdown.model';
import { IQuestion } from 'src/app/IQuestion';

@Injectable()
export class QuizService {
    baseUrl = "https://localhost:44354";
    seconds: number = 0;
    timer: null | ReturnType<typeof setTimeout> = null;
    qnProgress: number = 0;
    correctAnswerCount: number = 0;
    questions: IQuestions[] = [];

    constructor(private httpClient: HttpClient) {
    }

    public displayTimeElapsed() {
        return Math.floor(this.seconds / 3600) + ":" + Math.floor(this.seconds / 60) + ":" + Math.floor(this.seconds % 60);
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side error: ', errorResponse.error.message);
        }
        else {
            console.error('Server side error: ', errorResponse)
        }
        return throwError('There is a problem with the service. It has been notified and we are working on it. Please try again later');
    }

    getParticipantName() {
        var participant = JSON.parse(localStorage.getItem('participant') || 'Participant');
        return participant.Name;
    }

    addParticipant(participant: IParticipant): Observable<IParticipant> {
        return this.httpClient.post<IParticipant>(this.baseUrl + "/api/Participant/Insert", participant, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    getQuestions(categoryId: number, numOfQuestions: number): Observable<IQuestions[]> {
        let params = {
            "CategoryId": categoryId.toString(),
            "numOfQuestions": numOfQuestions.toString()
        };
        return this.httpClient.get<IQuestions[]>(this.baseUrl + "/api/Quiz/Questions", { params: params }).pipe(catchError(this.handleError));
    }

    submitScore() {
        var body = JSON.parse(localStorage.getItem('participant') || 'Participant');
        body.Score = this.correctAnswerCount;
        body.TimeSpent = this.seconds;
        return this.httpClient.post(this.baseUrl + "/api/Participant/Update", body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    GetQuestionCategories(): Observable<DropdownModel[]> {
        return this.httpClient.get<DropdownModel[]>(this.baseUrl + "/api/Category/GetCategories", {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    addQuestion(question: IQuestion): Observable<IQuestion> {
        return this.httpClient.post<IQuestion>(this.baseUrl + "/api/Question/Insert", question, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateQuestion(question: IQuestion): Observable<boolean> {
        return this.httpClient.put<boolean>(this.baseUrl + "/" + question.QnID, question, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    getAllQuestions(): Observable<IQuestion[]> {
        return this.httpClient.get<IQuestion[]>(this.baseUrl + "/api/Question/GetAll").pipe(catchError(this.handleError));
    }

    getQuestion(QnID: number) {
        let params = {
            "QnID": QnID.toString()
        };
        return this.httpClient.get<IQuestion>(this.baseUrl + "/api/Question/Get", { params: params }).pipe(catchError(this.handleError));
    }

}