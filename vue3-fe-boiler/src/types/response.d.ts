declare interface BaseResponse {
  errorCode: number;
  errorMessage: string;
}

type MergeRes<Base, Res> = {
  [k in keyof Base | keyof Res]: k extends keyof Base
    ? Base[k]
    : k extends keyof Res
    ? Res[k]
    : never;
};

