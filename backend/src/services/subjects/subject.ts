class Subject {


   #events: Map<string, Array<()=> void>> = new Map();

   constructor(events: Array<string>) {

      events.forEach((event) => {
         this.#events.set(event, []);
      });
   }

   subscribe(event: string, func: () => void) {

   }


}