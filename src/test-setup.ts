import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Полифил fetch для Jest-тестов (Firebase/AngularFire)
import fetch, { Response, Headers, Request } from 'node-fetch';
global.fetch = fetch as any;
global.Response = Response as any;
global.Headers = Headers as any;
global.Request = Request as any;

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
