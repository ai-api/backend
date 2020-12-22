import { Subject } from './subject';

/**
 * Description. This class container all functions that relate
 * to performing any CRUD operations on a user. It follows both
 * the Singleton design pattern, and is also a Subject that other
 * classes/objects can subscribe to 
 */
export class UserService extends Subject {

   /**
    * @instance stores the glocal instance of the userService
    */
   private static instance: UserService;

   /**
    * The constructor is private so that no one accidentally
    * calls a new reference to the UserService. Instead, call
    * UserService.getInstance() 
    */
   private constructor() {
      /**
       * @userServiceEvents are all of the valid events 
       * that the UserService Subject can invoke. Other
       * classes/objects can subscribe to 'listen' for 
       * them
       */
      let userServiceEvents = [
         'create',
         'get',
         'update',
         'delete'
      ]
      super(userServiceEvents);
   }

   public create(): void {
      this.notify('create', {});
   }

   /**
    * Description. Will return the instance of the UserService 
    * if it already exists. If it doesn't exist, will create a
    * new instance and return that
    */
   public static getInstance() {
      if (!UserService.instance) {
         UserService.instance = new UserService();
      }
      return UserService.instance;
   }

}