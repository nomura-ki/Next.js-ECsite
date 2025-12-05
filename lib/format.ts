export const formatPrice = (price: number) => `¥${price.toLocaleString()}`;
export const formatDate = (date: string) => new Date(date).toLocaleString();
