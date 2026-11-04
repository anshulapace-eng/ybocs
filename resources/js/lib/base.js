/**
 * Central place for the app's base path / URL prefix.
 *
 * Use `baseUrl("/patients")` anywhere a path is needed (Link href, router.post,
 * router.patch, router.delete, useForm().post, etc.) instead of hardcoding
 * the path, so the prefix only ever needs to change in ONE place.
 *
 * Current setup: the Apache VirtualHost's DocumentRoot points directly at
 * this project, so the app is served from the domain root — BASE_PATH is "".
 *
 * If you ever serve this app under a URL sub-path instead (e.g. Apache
 * Alias "/ybocs" -> this project, while the VirtualHost/DocumentRoot itself
 * is still the shared root), set BASE_PATH = "/ybocs" here and every link,
 * form post, and redirect in the app will automatically use it.
 */
export const BASE_PATH = "";

export function baseUrl(path = "") {
  if (!path || path === "/") return BASE_PATH || "/";
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
