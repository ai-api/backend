export class Subject {

   private events: Map<string, Array<(obj: any)=> void>> = new Map();

   /**
    * Description. Must be called from any children classes.You can
    * do this by calling super(events) from within the constructor
    * of the derived class
    * @param events An array of strings that represent
    * all of the possible events
    */
   public constructor(events: Array<string>) 
   {
      /* Add the event names to the events map */
      events.forEach((event) => {
         this.events.set(event, []);
      });
   }

   /**
    * Description. This function can only be called 
    * from within the derived classes. This is because
    * each Subject should be solely in charge of notifiying
    * any observers
    * @param event The name of the event you want 
    * to evoke. 
    */
   protected notify(event: string, obj: any): void 
   {
 
      let eventFuncs = this.events.get(event);
      /* If the event doesn't exist, throw an error */
      if (eventFuncs === undefined) {
         throw new Error('This subject does not contain this event');
      }

      /**
       * Call each function for the event
       */
      eventFuncs.forEach((event) => {
         event(obj);
      });

   }

   public subscribe(event: string, func: () => void): void 
   {
      let eventFuncs = this.events.get(event);
      /* If the event doesn't exist, throw an error */
      if (eventFuncs === undefined) {
         throw new Error('This subject does not contain this event');
      }
      /* Add the event to this.#events */
      eventFuncs.push(func);
      this.events.set(event, eventFuncs);
   }
}