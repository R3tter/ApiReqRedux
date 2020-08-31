# ApiRequestRedux
ApiRequestRedux works only with redux.
## Installation
```$ npm i api-request-redux```
## Usage
```import { apiRequestRedux } from 'api-req-redux';```

```apiRequestRedux``` - it is a function that takes global configuration object,
 and store it for apiRequest function, which you will use to perform actual request
``` 
   const apiRequest = apiRequestRedux({
      store: () => store,
      refreshFnc: state => ...your code, // function
      headers: state => [["Content-Type", "application/json"], ["token", state.userToken]]
      onErrorFnc: handleError //function
    });
```

Than use apiRequest to create request:
``` 
    export const login = data => async dispatch => {
      await apiRequest({
        url: '/api/login',
        body: data,
        method: 'POST',
        onStart: (dispatch) => dispatch(({ type: 'login/start' })),
        onSuccess: (data, dispatch) => dispatch(({ type: 'login/success', payload: data })),
        onError: (err, dispatch) => dispatch(({ type: 'login/error', payload: err }))
      });
    };
 ```
 ## Options
 - apiRequestRedux
    
    - store - function that returns redux store
    - refreshConfig - takes the same parameters as apiRequest
    - headers - function that take current state and return array entries like this:
       ```
       const getHeaders = state => [
         ['Content-Type', 'application/json'],
         ['x-language', state.Cached.language],
         ['Authorization', selectAuthToken(state) || selectCachedToken(state)]
       ];
       ```  
     - errorCodes - array of codes on wich you whant to handle by default (onErrorFnc)  
     - defaultCredentials - default credentials for all requests in application, by default: 
      ```
      defaultCredentials = 'same-origin',
      ```
     - onErrorFnc - will be called when errorCodes.includes(fetch.status)
     - reset - will be called if refresh token failed
 -  apiRequest
    - url - request endpoint
    - method - request method (GET, POST, PUT, etc..)
    - body - object with data you want to send with request (also you can selector)
    - additionalHeaders - additional headers for this request. Function similar to headers
    - onStart - functions that called before fetch, you can use it to change redux store before make request
    - onError - functions that called when fetch fail, you can use it to change redux store, and perform error handling. Takes error as parameter
    - onSuccess - functions that called when fetch successed, you can use it to change redux store, and perform success handleing. Takes data as parameter
    - selector - function, use it to select data from your store and pass as request body, takes state as parameter.
    - credentials - credentials for this request, by default `defaultCredentials`
    - useDefaultErrorHandler - boolean, if you dont want to use defaultError handling on this request set it to `false`, by default - `true`
    - removeHeaders - array of header keys, example:
      ```
      ['content-type']
      ```    
    - bodyParser - using this function you can replace default ```JSON.stringify(body)``` and modify body as you want
    - isRefresh - boolean, in case you don't want to 
    call refresh token on this request (default: true)
      
    

