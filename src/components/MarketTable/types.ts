export enum SortColumns {
  NAME = 'name',
  PRICE = 'price',
  PRICE_CHANGE = 'priceChange',
  VOLUME = 'volume',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortValue = `${SortColumns}_${SortOrder}`;