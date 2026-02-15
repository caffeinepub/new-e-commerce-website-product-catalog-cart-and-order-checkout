import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type OrderId = bigint;
export type Time = bigint;
export interface OrderItem {
    productId: ProductId;
    quantity: Quantity;
}
export type Quantity = bigint;
export type ProductId = bigint;
export interface NewOrder {
    contactInfo: string;
    shippingAddress: string;
    items: Array<OrderItem>;
}
export interface Order {
    id: OrderId;
    total: bigint;
    customer: Principal;
    createdAt: Time;
    items: Array<OrderItem>;
}
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    available: boolean;
    image: string;
    price: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(name: string, price: bigint, image: string, description: string): Promise<ProductId>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrders(customer: Principal): Promise<Array<Order>>;
    getOrder(orderId: OrderId): Promise<Order>;
    getProduct(id: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(orderData: NewOrder): Promise<OrderId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    setProductAvailability(id: ProductId, available: boolean): Promise<void>;
    updateProduct(id: ProductId, name: string, price: bigint, image: string, description: string): Promise<void>;
}
