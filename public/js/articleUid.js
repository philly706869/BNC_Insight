export const articleUid = parseInt(
  location.pathname.slice(
    location.pathname.lastIndexOf("/") + 1,
    location.pathname.length
  )
);
