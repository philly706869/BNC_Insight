const _categories = ["Financial", "Economy", "Social", "IT", "Science"];
export const categories: Category[] = _categories;
export type Category = (typeof _categories)[number];
