import Dexie, { Table } from "dexie";

export interface Synchronized {
  id?: number;
  entity: string;
  date: Date | null;
}
export interface Product {
  id?: number;
  code: string;
  SKU: string;
  name: string;
  avatar_id: string;
  customer_id: number;
  category_id: number;
  unit_id: number;
  file_id: number;
  bar_code: string;
  in_price: number;
  out_price: number;
  size: string;
  is_property: string;
  weight: number;
  cube: number;
  length: number;
  width: number;
  height: number;
  brand: string;
  color: string;
  material: string;
  is_unit_convert: string;
  is_active: string;
  is_serial: string;
  is_lot: string;
  note: string;
}

export interface Category {
  id: number;
  code: string;
  name: string;
  parent_id: number;
  is_active: string;
  note: string;
}

export interface Province {
  id: number;
  province_id: number;
  title: string;
  is_city: string;
}

export interface District{
  id:number,
  district_id:number,
  title:string,
  province_id:number,
  type:string,
  location:string
}

export class MySubClassedDexie extends Dexie {
  synchronized!: Table<Synchronized>;
  product!: Table<Product, number>;
  category!: Table<Category>;
  province!: Table<Province>;
  district!: Table<District>;
  constructor() {
    super("myDatabase");
    this.version(1).stores({
      synchronized: "++id,entity",
      product: "++id,customer_id",
      category: "++id",
      province: "++id,province_id",
      district: "++id,province_id",
    });
    this.open().catch(function (err) {
      console.error("Failed to open db: " + (err.stack || err));
    });
  }
}

export const db = new MySubClassedDexie();
