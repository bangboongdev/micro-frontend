
  
  declare interface Company {
    avatar_id:string;
    name: string;
    email: string;
    mobile_no: string;
    fax: string;
    address: string;
    address_2: string;
    province: Select| any;
    district: Select | undefined;
    domain: string;
    ins_date: Date | string;
    expired_date: Date | string;
    province_id: string | null;
    district_id: string | null;
    [key:string]:any
  }
  