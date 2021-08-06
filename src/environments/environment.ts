// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://192.168.100.3:3300/api', //Phone
  apiUrl: 'http://localhost:3300/api', //NodeJS
  //apiUrl: http://localhost:8080    //Spring
  PUSHER_API_KEY: '22c8d45dd4c3c860bf17', 
  PUSHER_API_CLUSTER: 'eu',
  JWT_TOKEN:'JWT_TOKEN',
  MAX_OVERDUE:25
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
