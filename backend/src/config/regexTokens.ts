export default {
   /**
    * usernames must:
    * 1. Be 3-20 chars long
    * 2. no _ or . at beginning
    * 3. no __ or _. or .. inside
    * 4. [a-zA-Z0-9._] are all allowed chars
    * 5. no _ or . at the end
    */
   'username':/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,

   /**
    * passwords must:
    * 1. be 8-50 chars long
    * 2. have at least 1 number
    * 3. have at least 1 letter
    */
   'password':/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,50}$/
};