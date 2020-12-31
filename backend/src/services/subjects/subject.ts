export class Subject {

   private events: Map<string, Array<(obj: any)=> void>> = new Map();

   /**
    * Must be called from any children classes.You can
    * do this by calling super(events) from within the constructor
    * of the derived class
    * @param events An array of strings that represent
    * all of the possible events
    */
   public constructor(events: Array<string>) {

      events.forEach((event) => {
         this.events.set(event, []);
      });
   }

   /**
    * Runs all of the functions that correspond to this
    * event name
    * 
    * This function can only be called 
    * from within the derived classes. This is because
    * each Subject should be solely in charge of notifiying
    * any observers
    * @param event The name of the event you want 
    * to evoke. 
    */
   protected notify(event: string, obj: any): void {

      const eventFuncs = this.events.get(event);
      if (eventFuncs === undefined) {
         throw new Error('This subject does not contain this event');
      }

      eventFuncs.forEach((event) => {
         event(obj);
      });
   }

   /**
    * Allows other classes/objects to listen for the events
    * that this subject emits. 
    * @param event The event name to listen for
    * @param func The function you want to run on that event
    */
   public subscribe(event: string, func: () => void): void {

      const eventFuncs = this.events.get(event);
      if (eventFuncs === undefined) {
         throw new Error('This subject does not contain this event');
      }
      eventFuncs.push(func);
      this.events.set(event, eventFuncs);
   }
}