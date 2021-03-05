export const lenientStrCompare = (a, b) => {
    return (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();
};

export const lenientObjectCompare = (a, b, fields) => {
    return fields.every((field) => lenientStrCompare(a[field], b[field]));
};
