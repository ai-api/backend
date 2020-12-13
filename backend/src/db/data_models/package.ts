interface Package {
    id?: number;
    userId?: number;
    lastUpdated?: string;
    numApiCalls?: number;
    name?: string;
    category?: string;
    description?: string;
    input?: string;
    output?: string;
    mardown?: string;
}

class Package {
    constructor(id: number){
        this.id = id;
        //initialize other variables
    }
    create(){
        //TODO
    }
    read(){
        //TODO
    }
    update(){
        //TODO  
    }
    delete(){
        //TODO 
    }
}
export default Package;