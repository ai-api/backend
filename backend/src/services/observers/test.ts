import { UserService } from '../subjects/userService';

export class Test {

   private name: string;

   constructor(n: string) {
      this.name = n;
      UserService.getInstance().subscribe('create', () => {
         this.printName();
      });
   }

   private printName() {
      console.log('Name: ' + this.name);
   }

}