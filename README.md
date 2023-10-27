This application shows how to implement a CRA application offline.

To do this, all requests are sent to the built-in DAL, which forms a queue of requests.
(all files related to request queue technology are located in the requestQueue directory)

The application controls the state of the network connection using native window events (offline & online), to which the application subscribes via a custom useControlConnection hook.
The technology implements control of tabs where offline requests were executed (when switching to online, requests are sent by the tab that created it - to prevent duplication). When such a tab is closed, its requests are overridden by another tab. If there are no other tabs (of the same domain) when a tab is closed, all offline requests are cleared (it is possible to implement a different scenario).

ALGORITHM FOR ADDING A NEW QUERY TYPE
   1. Add a request type to the enum RequestMethod.
   2. Create an interface to type the stored payload for rollback.
   3. Add a static method to class AsyncAppDAL in which:
      3.1 Create a request title (used to identify the request as well as display it in the QueueRequestsMonitor component) using the private static method _requestTitleCreator (title consists of 3 parts: effect (action), operand (entity on which the action is performed), id (entity identifier, optional argument))).
      3.2 A requestConfig is created via class RequestConfig.
      3.3 A rollback is created via the Rollback class.
      3.4. A request is created via class AppRequest.
   4. Add a method to class BllAction to change the application's state (before sending the request to the server).
   5. Add a method to class RollbackAction to perform a rollback of the application's state (in case the server receives a negative response to the request or the user cancels the request). To perform rollback in some cases you will need payload, which is stored in an instance of class AppRequest.
   6. Add a method to class ResponseResolveAction to handle a positive server response to this request (if necessary, modify the application state).
   7. Add a method to class ResponseRejectAction to handle a negative server response to this request.
   8. Add a pair to the optimizationPairs and destroyPairs objects (request optimization dependency). If when adding a request to the queue there is a request related to the same entity and the same instance in the queue, and the request is not yet processed by the httpEngine algorithm (the inProgress property of the AppRequest instance is set to false), then the two requests are optimized by cases:
      8.1 If there is a CREATE or UPDATE request in the queue and an UPDATE request is added to the queue - the existing request in the queue updates its payloads to be sent to the server taking into account the last request (no new request is added to the queue), the rollback of the request remains the same.
      8.2 If there is a CREATE request in the queue and a DELETE request is added to the queue - the existing CREATE request is removed from the queue (no new request is added to the queue).
      8.3 In all other cases, a new request is added to the queue.


REQUEST SENDING ALGORITHM
All requests to the server are made through redux, using redux-thunk.
The mode of sending requests from the queue is used only after user login, before that all requests are sent via axios-auth-instance.
To add a request to the queue, it is necessary in the corresponding thunkCreator-function:
   1. Call the corresponding static method of the AsyncAppDAL class and pass in the parameters:
      dispatch;
      getState;
      data for forming a payload request and changing the application's state;
QueueRequestMonitor is provided to monitor the status and edit the request queue. Its functionality allows you to view the current request queue of an open tab, as well as delete requests one by one or all at once (with rollback of the state).
