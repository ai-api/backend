import { Subject } from './subject';
import config from '../../config/config';
import Package from '../../models/dataModels/package';
import DbPool from '../../db/pool';
import Categories from '../../db/enums/categories';
import { HttpError } from '../../models/httpModels/httpError';
import { HttpPackage } from '../../models/httpModels/httpPackage';

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
    * @return An HttpPackage that contains all of the newly created
    * object's parameters
    */
   public async create(userId: number, name: string, category: string, 
      description: string, input: string, output: string, md: string):
      Promise<HttpPackage> {
      
      /* Make category into a number for the database */
      const catString = this.categoryStringToNum(category);
      try {
         const client = await DbPool.connect();
         const newPackage = await Package.createInstance(client, userId, name, 
            catString, description, input, output, [], md);
         await newPackage.save();
         client.release();
         this.notify('create', newPackage);
         return new HttpPackage(201, newPackage);
      }
      catch(err) {
         throw new HttpError(500, 'Could not create the package specified');
      }
   }

   /**
    * Returns the package corresponding to the packageId provided
    * @param packageId The id of the package to read
    * @return An HttpPackage that contains all of the newly created
    * object's parameters
    */
   public async read(packageId: number): Promise<HttpPackage> {
      const client = await DbPool.connect();
      try {
         const foundPackage = await Package.getInstance(client, packageId);
         this.notify('read', foundPackage);
         return new HttpPackage(200, foundPackage);
      }
      catch(err) {
         switch(err.message) {
         case 'Package information could not be retrieved from database':
            throw new HttpError(404, 'Package not found');
         default:
            throw new HttpError(500, 'Couldn\'t complete request');
         }
      }
      finally {
         client.release();
      }
   }

   public async update(packageId: number, userId: number, 
      name: string | undefined, category: string | undefined,
      description: string | undefined, input: string | undefined, 
      output: string | undefined, md: string | undefined)
      : Promise<HttpPackage> {

      /* Grab the current value in the database */
      const client = await DbPool.connect();
      let foundPackage: Package;
      try {
         foundPackage = await Package.getInstance(client, packageId);
      }
      catch(err) {
         throw new HttpError(404, 'Package not found');
      }

      /* If the package userId and this userId aren't the same, throw error */
      if (foundPackage.userId != userId) {
         throw new HttpError(401, 'Only the owner of this package can modify it');
      }

      /* Change all params that weren't undefined */
      if (name) {
         foundPackage.name = name;
      }
      if (category) {
         foundPackage.category = this.categoryStringToNum(category);
      }
      if (description) {
         foundPackage.description = description;
      }
      if (input) {
         foundPackage.input = input;
      }
      if (output) {
         foundPackage.output = output;
      }
      if (md) {
         foundPackage.markdown = md;
      }
      if (packageId != await foundPackage.save()) {
         throw new HttpError(500, 'Could not update the package');
      }

      this.notify('update', foundPackage);
      return new HttpPackage(200, foundPackage);
   }
   ///////////////////////////////////////////////////////////////////////////
   ///////////////////////// PRIVATE HELPER METHODS //////////////////////////
   ///////////////////////////////////////////////////////////////////////////
   
   /**
    * Returns the corresponding number for each category
    * @param category the category as a string
    */
   private categoryStringToNum(category: string): number {
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
         throw new HttpError(400, 'Invalid Category name');
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