import {createPackage} from '../dbOperations'

interface Package {
    id?: number;
    userId: number;
    lastUpdated?: string;
    numApiCalls?: number;
    name: string;
    category: string;
    description: string;
    input: string;
    output: string;
    markdown?: string;
    flags: Array<string>;
}

class Package {
    constructor(userId: number, name: string, category: string, 
        description: string, input: string, output: string, flags: Array<string>){
        this.userId = userId;
        this.name = name;
        this.category = category;
        this.description = description;
        this.input = input;
        this.output = output;
        this.flags = flags;
        this.markdown = '';
    }
    create(client: any){
        createPackage(client, this);
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