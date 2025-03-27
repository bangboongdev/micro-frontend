declare interface Params {
  pageSize: number | string;
  pageIndex: number | string;
  filters?: Array<string>;
}
declare interface DynamicParams {
  [key:string]:any
}
declare interface Id{
  id:string | number
}