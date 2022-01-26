export type ApiResponse<T> = {
    success?: boolean;
    message?: string;
    data: T;
};


export type PageResponse<T> = {
    success?: boolean;
    message?: string;
    data: PageInfo<T>;
}


export type PageInfo<T> = {
    success?: boolean;
    data: T;
    total?: number; 
}

