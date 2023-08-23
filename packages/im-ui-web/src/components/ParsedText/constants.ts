/* eslint-disable no-useless-escape */
export const PATTERNS = {
  /**
   * Segments/Features:
   *  - http/https support https?
   *  - auto-detecting loose domains if preceded by `www.`
   *  - Localized & Long top-level domains \.(xn--)?[a-z0-9-]{2,20}\b
   *  - Allowed query parameters & values, it's two blocks of matchers
   *    ([-a-zA-Z0-9@:%_\+,.~#?&\/=]*[-a-zA-Z0-9@:%_\+~#?&\/=])*
   *    - First block is [-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]* -- this matches parameter names & values (including commas, dots, opening & closing brackets)
   *    - The first block must be followed by a closing block [-a-zA-Z0-9@:%_\+\]~#?&\/=] -- this doesn't match commas, dots, and opening brackets
   */
  url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/i,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
  email: /\S+@\S+\.\S+/,
};
