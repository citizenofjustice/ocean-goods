"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByFinalPrice = void 0;
/**
 * This function sorts an array of items with price and discount by their final price.
 * The final price is calculated as the original price minus the discount.
 *
 * @param items - An array of items with price and discount to sort.
 * @param direction - The direction to sort the items. Can be "asc" for ascending or "desc" for descending.
 * @throws {Error} Will throw an error if the direction is not "asc" or "desc".
 * @returns An array of items with price and discount sorted by their final price.
 */
const sortByFinalPrice = (items, direction) => {
    // Calculate the final price for each item
    const itemsWithFinalPrice = items.map((item) => (Object.assign(Object.assign({}, item), { finalPrice: item.price - Math.round((item.price * item.discount) / 100) })));
    // Sort the items by the final price in the specified direction
    switch (direction) {
        case "asc":
            itemsWithFinalPrice.sort((a, b) => a.finalPrice - b.finalPrice);
            break;
        case "desc":
            itemsWithFinalPrice.sort((a, b) => b.finalPrice - a.finalPrice);
            break;
        default:
            throw new Error(`Invalid sort direction: ${direction}. Expected "asc" or "desc".`);
    }
    return itemsWithFinalPrice;
};
exports.sortByFinalPrice = sortByFinalPrice;
