import User from '../dataModels/user';

export class HttpUser {

   public readonly username: string;
   public readonly email: string;
   public readonly apiKey: string;
   public readonly profilePicture: string;
   public readonly statusCode: number;

   public constructor(statusCode: number, user: User) {
      this.statusCode = statusCode;
      this.username = user.username;
      this.email = user.email;
      this.apiKey = user.apiKey;
      this.profilePicture = user.profilePicture;
      this.statusCode = statusCode;
   }

}