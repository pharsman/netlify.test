const isLocal = location.href.includes("localhost");
const pathPrefix = isLocal ? "" : "/recruitment/oneadmin/front";
export const blankPathPrefix = isLocal ? "" : "/recruitment/oneadmin/front";
export default pathPrefix;
