import Package from '../dataModels/package';
import Categories from '../../db/enums/categories';

/**
 * This class should be used anytime a service wants to
 * send a Package in the body of an HTTP Response. 
 */
export class HttpPackage {   
   public readonly id: number;
   public readonly userId : number;
   public readonly dateLastUpdated: Date;
   public readonly name: string;
   public readonly category: string;
   public readonly description: string;
   public readonly input: string;
   public readonly output: string;
   public readonly markdown : string;
   public readonly statusCode: number;

   public constructor(statusCode: number, pack: Package) {
      this.statusCode = statusCode;
      this.id = pack.id;
      this.userId = pack.userId;
      this.dateLastUpdated = pack.dateLastUpdated;
      this.name = pack.name;
      this.category = this.catNumToString(pack.category);
      this.description = pack.description;
      this.input = pack.input;
      this.output = pack.output;
      this.markdown = pack.markdown;
   }

   public format(): string {
      return JSON.stringify(this);
   }
   private catNumToString(catNum: number): string {
      return Categories[catNum].toString().toLowerCase();
   }
}