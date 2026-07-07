// Typescript declaration for 

type UserRoles = "super_admin" | "admin" | "hod" | "teacher" | "student" | "parent" | "accountant";

type RateLimitRole = UserRoles | "guest"; 

/**RateLimitRole type is required because every API request will pass through the Auth middleware 
 * that will subsequently get the user info from cookie and set the user role. If no user, the role will be guest   */  