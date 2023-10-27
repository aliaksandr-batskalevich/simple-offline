   В данном приложении показан способ реализации работы приложения CRA в оффлойн-режиме.

   Для этого все запросы поступают во встроенный DAL, который формирует из запросов очередь.
(все файлы, касающиеся технологии очереди запросов находятся в каталоге requestQueue)

   Приложение контролирует состояние соединение с сетью при помощи нативных событий window (offline & online), на которые приложение подписывается через кастомный хук useControlConnection.

   В технологии реализован контроль вкладок, в которых выполнялись запросы в оффлайне (при переходе в онлайн запросы отправляет та вкладка, которая его создавала - для предотвращения дублирования). При закрытии такой вкладки ее запросы переопределяются другой вкладке. Если при закрытии вкладки другие (того же домена) отсутствуют - все запросы оффлайн-режима очищаются (возможно реализовать иной сценарий).


АЛГОРИТМ ДОБАВЛЕНИЯ НОВОГО ТИПА ЗАПРОСА
   1. Добавить в enum RequestMethod тип запроса.
   2. Создать интерфейс для типизации хранимого payload для rollback.
   3. Добавить в class AsyncAppDAL статический метод, в котором:
      3.1. Создается title запроса (используется для идентификации запроса, а также отображения его в компоненте QueueRequestsMonitor), используя приватный статический метод _requestTitleCreator (title состоит из 3-х частей: effect (действие), operand (сущность, над которой выполняется действие), id (идентификатор сущности, необязательный аргумент)).
      3.2. Создается requestConfig через class RequestConfig.
      3.3. Создается rollback через class Rollback.
      3.4. Создается request через class AppRequest.
   4. Добавить в class BllAction метод для изменения стэйта приложения (до направления запроса на сервер).
   5. Добавить в class RollbackAction метод для выполнения rollback стэйта приложения (для случая получения отрицательного ответа сервера на запрос или отмены запроса пользователем). Для выполнения rollback в некоторых случаях понадобится payload, хранение которого предусмотрено в экземпляре class AppRequest.
   6. Добавить в class ResponseResolveAction метод для обработки положительного ответа сервера на данный запрос (при необходимости, изменение стэйта приложения).
   7. Добавить в class ResponseRejectAction метод для обработки отрицательного ответа сервера на данный запрос.
   8. Добавить пару в объекты optimizationPairs и destroyPairs (зависимость оптимизирования запросов). Если при добавлении запроса в очередь в ней находится запрос, косающийся той-же сущности и тому же экземпляру и рассматриваемый запрос еще не обрабатывается алгоритмом httpEngine (свойство inProgress экземпляра AppRequest имеет значение false), два запроса оптимизируются по кейсам:
      8.1. Если в очереди имеется запрос CREATE или UPDATE и в очередь добавляется запрос UPDATE - имеющийся запрос в очереди обновляет свои payload для отправки на сервер с учетов последнего запроса (новый запрос в очередь не добавляется), rollback запроса при этом остается прежним.
      8.2. Если в очереди имеется запрос CREATE и в очередь добавляется запрос DELETE - имеющийся запрос (CREATE) из очереди удаляется (новый запрос в очередь не добавляется).
      8.3. Во всех остальных случаях в очередь добавляется новый запрос.


АЛГОРИТМ ОТПРАВКИ ЗАПРОСА
   Все запросы на сервер выполняются через redux, используя redux-thunk.
   Режим отправки запросов из очереди используется только после логинизации пользователя, до этого все запросы отправляется через axios-auth-instance.

   Для добавления запроса в очередь необходимо в соответствующей thunkCreator-функции:
   1. Вызвать соответствующий статический метод класса AsyncAppDAL и передать в параметры:
      dispatch;
      getState;
      данные для формирования payload запроса и изменения стэйта приложения;


   Для контроля состояния и редактирования очереди запросов предусмотрен QueueRequestMonitor, функционал которого позволяет просматривать текущую очередь запросов открытой вкладки, а также удалять запросы по одному либо все сразу (с выполнением rollback стэйта).
