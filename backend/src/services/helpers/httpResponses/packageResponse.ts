import Package from '../../../db/data_models/package';
import Categories from '../../../db/enums/categories';

export default class HttpPackage {   
   private readonly id: number;
   private readonly userId : number;
   private readonly dateLastUpdated: Date;
   private readonly name: string;
   private readonly category: string;
   private readonly description: string;
   private readonly input: string;
   private readonly output: string;
   private readonly markdown : string;

   public constructor (pack: Package) {
      this.id = pack.idNum;
      this.name = pack.name;
      this.userId = pack.userId;
      this.dateLastUpdated = pack.dateLastUpdated;
      this.category = this.categoryNumToString(pack.categoryId);
      this.description = pack.description;
      this.input = pack.input;
      this.output = pack.output;
      this.markdown = pack.md;
   }

   public format(): any {
      return {
         id: this.id,
         name: this.name,
         userId: this.userId,
         dateLastUpdated: this.dateLastUpdated,
         category: this.category,
         description: this.description,
         input: this.input,
         output: this.output,
         markdown: this.markdown
      };
   }

   private categoryNumToString(category: number): string {
      return Categories[category];
   }

}