export enum CUSTOMER_TYPE { 
    Employee = 'Employee',
    Affiliate = 'Affiliate',
    Normal = 'Normal'
};

const dateDiffInYears = (registeredDate) => { 
 const diff = (registeredDate.getTime() - Date.now()) / (60 * 60 * 24 * 1000);
 return Math.abs(Math.round(diff/365.25));  
}

export class User {
    private registeredOn: Date;
    private type: CUSTOMER_TYPE;
    private name: string;
    readonly discountPercent: number;
    
    constructor(name : string,registeredOn: Date,type: CUSTOMER_TYPE = CUSTOMER_TYPE.Normal) {
        this.type = type;
        this.name = name;
        if((new Date()) < registeredOn ) {
            throw new Error('INVALID_DATE')
        }
        this.registeredOn = registeredOn;
        this.discountPercent = 0;

        switch(this.type) {
            case CUSTOMER_TYPE.Employee:
                this.discountPercent = 30;
                break;
            case CUSTOMER_TYPE.Affiliate:
                this.discountPercent = 10;
                break;
            default:
                if(dateDiffInYears(this.registeredOn) >= 2) {
                    this.discountPercent = 5;
                }
        } 
    }
}