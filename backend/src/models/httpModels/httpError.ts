/**
 * This class should be used to throw any errors within 
 * any of the service classes. This way, when an error 
 * is thrown, our routes can know exactly what status
 * code to return with
 */
export default class HttpError extends Error {
   readonly statusCode: number;
   
   /**
    * @param statusCode The status code that the route should
    * respond with
    * @param message A short description saying what went wrong
    * Note, that this message will be returned in the body of 
    * the request, so make sure it's not too technical, nor
    * that it reveals anything the user should not be able to
    * see.
    */
   public constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
   }

   public format(): string {
      return JSON.stringify({
         Error: this.message
      });
   }
}