import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable()
export class SocketService {

    private url = 'https://chatapi.edwisor.com';

    private socket;


    constructor(public http: HttpClient) {
        // connection is being created.
        // that handshake
        this.socket = io(this.url);

    }

    // events to be listened 

    //   This event ("verifyUser") has to be listened on the user's end to verify user authentication.
    // user will only be set as online user after verification of authentication token.

    public verifyUser = () => {

        return Observable.create((observer) => {

            this.socket.on('verifyUser', (data) => {

                observer.next(data);
                console.log("verify user data is",data);

            }); // end Socket

        }); // end Observable

    } // end verifyUser

    //   This event ("online-user-list") has to be listened on the user's end to identify all available users that are currently online.
    // All available users can be shown to the user based on which he can start chatting with a user.
    // The output will be an object, object has key as userId and value as full name.

    public onlineUserList = () => {

        return Observable.create((observer) => {

            this.socket.on("online-user-list", (userList) => {

                observer.next(userList);
               
            }); // end Socket

        }); // end Observable

    } // end onlineUserList


    public disconnectedSocket = () => {

        return Observable.create((observer) => {

            this.socket.on("disconnect", () => {

                observer.next();

            }); // end Socket

        }); // end Observable



    } // end disconnectSocket

    // end events to be listened

    // events to be emitted

    //   This event ("set-user") has to be emitted when a user comes online.
    // User can only be set as online only after verification of authentication token. Which you have pass here. The following data has to be emitted
    // authentication token
    public setUser = (authToken) => {

        this.socket.emit("set-user", authToken);

    } // end setUser

    // events to be emitted

    //chat events

    //   This event's name is actually dynamic and refers to the userId of the logged in user.
    // This event ("userId") has to be listened to identify an individual chat message that has been received.
    // Example output it as follows:
    //                             {
    //                                 chatId: 'unique chat id',
    //                                 message: 'you message',
    //                                 createdOn: date, 
    //                                 receiverId: 'userId of receiver',
    //                                 receiverName: full name of receiver,
    //                                 senderId: 'userId of sender',
    //                                 senderName: 'full name of sender'
    //                             }
    public chatByUserId = (userId) => {
        console.log("Socket fn called");
        console.log(userId);
        return Observable.create((observer) => {
            this.socket.on(userId, (data) => {
                observer.next(data);
                console.log(data);
            });
        });
    }
    public SendChatMessage = (chatMsgObject) => {

        this.socket.emit('chat-msg', chatMsgObject);

    }
    //     This event ("mark-chat-as-seen") has to be emitted, when the user start chat with other user.
    // The following data has to be emitted
    //                             {
    //                                 userId: 'userId of user',
    //                                 senderId: 'userId of user from whom current user is chatting'
    //                             }

    public markChatAsSeen = (userDetails) => {
        

        this.socket.emit('mark-chat-as-seen', userDetails);

    } // end markChatAsSeen

    //to get paginated chats of user,below fn is used
    // here,
    // senderId	is userId of logged in user. 
    // receiverId	is userId receiving user.
    // skip	is skip value for pagination. 

    

    public getChat(senderId, receiverId, skip): Observable<any> {

      return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
        .do(data => console.log('Data Received'))
        .catch(this.handleError);
  
    } 

    public exitSocket = () =>{


      this.socket.disconnect();
  
  
    }// end exit socket

    public getUnseenChatUserList(userId):Observable<any>{
        return this.http.get(`${this.url}/api/v1/chat/unseen/user/list?userId=${userId}&authToken=${Cookie.get('authtoken')}`)
        .do(data => console.log('Data Received'))
        .catch(this.handleError);
    }
  



    private handleError(err: HttpErrorResponse) {

        let errorMessage = '';

        if (err.error instanceof Error) {

            errorMessage = `An error occurred: ${err.error.message}`;

        } else {

            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

        } // end condition *if

        console.error(errorMessage);

        return Observable.throw(errorMessage);

    }  // END handleError

}
