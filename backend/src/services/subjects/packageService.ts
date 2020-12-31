import { Subject } from './subject';
import config from '../../config/config';


/**
 * This class handles all operations on packages. It follows 
 * both the singleton design pattern and is also a subject
 * that other classes can subscribe to
 */
export class PackageService extends Subject {

   private static instance: PackageService;

   ///////////////////////////////////////////////////////////////////////////
   /////////////////////////// CONSTRUCTOR METHODS ///////////////////////////
   ///////////////////////////////////////////////////////////////////////////

   private constructor() {
      super(packageEvents);
   }
   
   /**
    * Will return the instance of the PackageService if
    * it already exists. If it doesn't exist, will create
    * a new instance and return that
    */
   public static getInstance(): PackageService {
      if (!PackageService.instance) {
         PackageService.instance = new PackageService();
      }
      return PackageService.instance;
   }

   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////////// PUBLIC METHODS //////////////////////////////
   ///////////////////////////////////////////////////////////////////////////


   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////// PRIVATE HELPER METHODS //////////////////////////
   ///////////////////////////////////////////////////////////////////////////
}

/**
 * @packageEvents are all of the valid events
 * that the PackageService Subject can invoke. 
 * Other classes/objects can subscribe to 'listen'
 * for them
 */
const packageEvents = [
   'create',
   'read',
   'update',
   'delete'   
];