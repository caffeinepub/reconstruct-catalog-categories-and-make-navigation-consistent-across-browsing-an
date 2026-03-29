import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Material {
    leather?: string;
    silk?: string;
    polyester?: string;
    cotton?: string;
    denim?: string;
}
export interface ShippingInfo {
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    email: string;
    address: string;
    phone: string;
}
export type Size = string;
export interface Cart {
    totalCents: bigint;
    items: Array<CartItem>;
}
export interface CartItem {
    size: Size;
    quantity: bigint;
    product: Product;
}
export interface Order {
    id: bigint;
    totalCents: bigint;
    orderTime: bigint;
    shippingInfo: ShippingInfo;
    items: Array<CartItem>;
}
export interface Product {
    id: bigint;
    collection: string;
    name: string;
    color: string;
    productType: string;
    available: boolean;
    imageUrl: string;
    gender: string;
    brand: string;
    priceCents: bigint;
    sizeRange: Array<Size>;
    material: Material;
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    addToCart(productId: bigint, size: Size, quantity: bigint): Promise<Cart>;
    checkout(shippingInfo: ShippingInfo): Promise<Order>;
    getAllProducts(): Promise<Array<Product>>;
    getCart(): Promise<Cart>;
    getOrder(orderId: bigint): Promise<Order | null>;
    getProduct(id: bigint): Promise<Product | null>;
    queryProducts(filters: {
        collection?: string;
        productType?: string;
        gender?: string;
        material?: string;
    }): Promise<Array<Product>>;
    removeFromCart(productId: bigint, size: Size): Promise<Cart>;
    seedProducts(): Promise<void>;
    updateCartItem(productId: bigint, size: Size, newQuantity: bigint): Promise<Cart>;
}
