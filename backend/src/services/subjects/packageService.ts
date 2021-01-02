import { Subject } from './subject';
import config from '../../config/config';
import Package from '../../db/data_models/package';
import pool from '../../db/pool';
import Categories from '../../db/enums/categories';
import ErrorResponse from '../helpers/httpResponses/errorResponse';
import PackageResponse from '../helpers/httpResponses/packageResponse';
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
   
   /**
    * Creates a package for the specified user
    * @param userId 
    * @param name 
    * @param category 
    * @param description 
    * @param input 
    * @param output 
    * @param md 
    * @return The id of the newly created package
    */
   async create(userId: number, name: string, category: string, 
      description: string, input: string, output: string, md: string):
      Promise<PackageResponse> {
      
      /* Make category into a number for the database */
      const catString = this.categoryStringToNum(category);
      try {
         const client = await pool.connect();
         const newPackage = await Package.createInstance(client, userId, name, 
            catString, description, input, output, md);
         await newPackage.save();
         return new PackageResponse(newPackage);
      }
      catch(err) {
         throw new ErrorResponse(500, err.message);
      }
   }
   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////// PRIVATE HELPER METHODS //////////////////////////
   ///////////////////////////////////////////////////////////////////////////
   
   categoryStringToNum(category: string): number {
      switch(category) {
      case 'image':
         return Categories.IMAGE;
      case 'text':
         return Categories.TEXT;
      case 'video':
         return Categories.VIDEO;
      case 'audio':
         return Categories.AUDIO;
      default:
         throw new ErrorResponse(400, 'Invalid Category name');
      }
   }
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