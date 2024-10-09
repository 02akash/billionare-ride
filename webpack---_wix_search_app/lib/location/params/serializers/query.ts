import decodeUriComponent from 'decode-uri-component';

export function decodeQueryFromPath(encodedQuery?: string): string | undefined {
  if (!encodedQuery) {
    return;
  }

  // NOTE 1: The query argument here have been decoded with `decodeURI()` in the viewer already
  // (return value of `wixCodeApi.location.path`). So some encoded chars have been replaced
  // (like %20 -> ' ' for spaces), but others that are not handled by decodeURI have not
  // been replaced ('?' is still %3F for example). Unfortunately, one of the decoded chars is the
  // percentage char itself used for encoding (%25 -> '%'). So directly calling native
  // decodeURIComponent('%') at this point will throw malformed URL exception. As a workaround
  // we are using 'decode-uri-component' package which does handle this case gracefully.

  // NOTE 2: In Bolt `wixCodeApi.location.to()` argument will be URL encoded internally, while
  // in Thunderbolt it will not be encoded. For compatibility we are double decoding here.

  return decodeUriComponent(decodeUriComponent(encodedQuery));
}

export function encodeQuery(query?: string): string | undefined {
  const trimmedQuery = query?.trim();
  return trimmedQuery ? trimmedQuery : undefined;
}

export function decodeQuery(encodedQuery?: string): string | undefined {
  return encodedQuery ? encodedQuery : undefined;
}
