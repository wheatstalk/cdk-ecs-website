# API Reference

**Classes**

Name|Description
----|-----------
[ListenerRulePriorities](#wheatstalk-cdk-ecs-website-listenerrulepriorities)|Listener rule priorities.
[ListenerRulesBuilder](#wheatstalk-cdk-ecs-website-listenerrulesbuilder)|Creates listener rules.
[NginxProxyContainerExtension](#wheatstalk-cdk-ecs-website-nginxproxycontainerextension)|Extends a TaskDefinition by adding an nginx proxy before the workload container.
[WebsiteService](#wheatstalk-cdk-ecs-website-websiteservice)|Create a website from an http-serving container.
[WebsiteServiceBase](#wheatstalk-cdk-ecs-website-websiteservicebase)|Base class for the builder-style website service classes.
[WordpressService](#wheatstalk-cdk-ecs-website-wordpressservice)|Create a wordpress website.


**Structs**

Name|Description
----|-----------
[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)|Configuration for authentication through a Cognito user pool.
[EcsWorkloadServiceInfo](#wheatstalk-cdk-ecs-website-ecsworkloadserviceinfo)|Provides information to `IEcsWorkload.useService` about the service.
[EcsWorkloadTaskInfo](#wheatstalk-cdk-ecs-website-ecsworkloadtaskinfo)|Provides information to `IEcsWorkload.useTaskDefinition` about the task definition.
[HttpContainerWorkloadOptions](#wheatstalk-cdk-ecs-website-httpcontainerworkloadoptions)|Props for `HttpContainerWorkload`.
[ListenerRulesBuilderProps](#wheatstalk-cdk-ecs-website-listenerrulesbuilderprops)|Props for `ListenerRulesBuilder`.
[NginxProxyContainerExtensionOptions](#wheatstalk-cdk-ecs-website-nginxproxycontainerextensionoptions)|Options for `NginxProxyContainerExtension`.
[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)|A redirect.
[WebsiteServiceBaseProps](#wheatstalk-cdk-ecs-website-websiteservicebaseprops)|Props for `WebsiteServiceBase`.
[WebsiteServiceOptions](#wheatstalk-cdk-ecs-website-websiteserviceoptions)|Non-workload options for `WebsiteServiceBase`.
[WebsiteServiceProps](#wheatstalk-cdk-ecs-website-websiteserviceprops)|Props for `WebsiteService`.
[WebsiteServicePropsAuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-websiteservicepropsauthwithuserpoolprops)|*No description*
[WordpressImageOptions](#wheatstalk-cdk-ecs-website-wordpressimageoptions)|Configuration options for building the WordPress container image.
[WordpressServiceProps](#wheatstalk-cdk-ecs-website-wordpressserviceprops)|Props for `WordpressService`.
[WordpressWorkloadOptions](#wheatstalk-cdk-ecs-website-wordpressworkloadoptions)|Props for `WordpressWorkload`.


**Interfaces**

Name|Description
----|-----------
[IEcsWorkload](#wheatstalk-cdk-ecs-website-iecsworkload)|Rough compatibility interface.
[IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)|A builder-pattern website service.


**Enums**

Name|Description
----|-----------
[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)|Type of capacity to use.



## class ListenerRulePriorities  <a id="wheatstalk-cdk-ecs-website-listenerrulepriorities"></a>

Listener rule priorities.


### Initializer




```ts
new ListenerRulePriorities()
```



### Methods


#### produce() <a id="wheatstalk-cdk-ecs-website-listenerrulepriorities-produce"></a>

Produce a listener rule priority.

```ts
produce(): number
```


__Returns__:
* <code>number</code>

#### *static* incremental(start, step?) <a id="wheatstalk-cdk-ecs-website-listenerrulepriorities-incremental"></a>

Incremental listener rule priorities.

```ts
static incremental(start: number, step?: number): ListenerRulePriorities
```

* **start** (<code>number</code>)  Priority to start at.
* **step** (<code>number</code>)  Step size for every new priority.

__Returns__:
* <code>[ListenerRulePriorities](#wheatstalk-cdk-ecs-website-listenerrulepriorities)</code>



## class ListenerRulesBuilder  <a id="wheatstalk-cdk-ecs-website-listenerrulesbuilder"></a>

Creates listener rules.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new ListenerRulesBuilder(scope: Construct, id: string, props: ListenerRulesBuilderProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ListenerRulesBuilderProps](#wheatstalk-cdk-ecs-website-listenerrulesbuilderprops)</code>)  *No description*
  * **albListener** (<code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code>)  The ALB listener to add listener rules to. 
  * **albPriority** (<code>[ListenerRulePriorities](#wheatstalk-cdk-ecs-website-listenerrulepriorities)</code>)  The strategy for allocating alb listener rule priorities. 
  * **primaryHostName** (<code>string</code>)  The primary host name to redirect to. 
  * **service** (<code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code>)  ECS service serving traffic. 
  * **trafficContainerName** (<code>string</code>)  Container to direct traffic to. 
  * **trafficPort** (<code>number</code>)  Port that the container listens on. 


### Methods


#### addAuthBypassServingHost(hostHeader, authBypassValue) <a id="wheatstalk-cdk-ecs-website-listenerrulesbuilder-addauthbypassservinghost"></a>

Add a host name on which the service should serve traffic when the `AccessBypass` header is provided in the requiest.

```ts
addAuthBypassServingHost(hostHeader: string, authBypassValue: string): void
```

* **hostHeader** (<code>string</code>)  *No description*
* **authBypassValue** (<code>string</code>)  *No description*




#### addAuthenticatedServingHost(hostHeader, authConfig) <a id="wheatstalk-cdk-ecs-website-listenerrulesbuilder-addauthenticatedservinghost"></a>

Adds a host name on which the service should serve traffic after authenticating with AWS Cognito.

```ts
addAuthenticatedServingHost(hostHeader: string, authConfig: CognitoAuthenticationConfig): void
```

* **hostHeader** (<code>string</code>)  *No description*
* **authConfig** (<code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code>)  *No description*
  * **domain** (<code>string</code>)  Domain name of the Cognito user pool IdP. 
  * **userPool** (<code>[IUserPool](#aws-cdk-aws-cognito-iuserpool)</code>)  The Cognito user pool to identify against. 




#### addRedirectResponse(hostHeader, redirectResponse) <a id="wheatstalk-cdk-ecs-website-listenerrulesbuilder-addredirectresponse"></a>

Adds a redirect for a given host name to another location.

```ts
addRedirectResponse(hostHeader: string, redirectResponse: RedirectOptions): void
```

* **hostHeader** (<code>string</code>)  *No description*
* **redirectResponse** (<code>[RedirectOptions](#aws-cdk-aws-elasticloadbalancingv2-redirectoptions)</code>)  *No description*
  * **host** (<code>string</code>)  The hostname. __*Default*__: No change
  * **path** (<code>string</code>)  The absolute path, starting with the leading "/". __*Default*__: No change
  * **permanent** (<code>boolean</code>)  The HTTP redirect code. __*Default*__: false
  * **port** (<code>string</code>)  The port. __*Default*__: No change
  * **protocol** (<code>string</code>)  The protocol. __*Default*__: No change
  * **query** (<code>string</code>)  The query parameters, URL-encoded when necessary, but not percent-encoded. __*Default*__: No change




#### addRedirectToPrimaryHostName(hostHeader) <a id="wheatstalk-cdk-ecs-website-listenerrulesbuilder-addredirecttoprimaryhostname"></a>

Adds a redirect for a given host name to the primary host name.

```ts
addRedirectToPrimaryHostName(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*




#### addServingHost(hostHeader) <a id="wheatstalk-cdk-ecs-website-listenerrulesbuilder-addservinghost"></a>

Adds a host name on which the service should serve traffic.

```ts
addServingHost(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*






## class NginxProxyContainerExtension  <a id="wheatstalk-cdk-ecs-website-nginxproxycontainerextension"></a>

Extends a TaskDefinition by adding an nginx proxy before the workload container.

__Implements__: [ITaskDefinitionExtension](#aws-cdk-aws-ecs-itaskdefinitionextension)

### Initializer




```ts
new NginxProxyContainerExtension(options: NginxProxyContainerExtensionOptions)
```

* **options** (<code>[NginxProxyContainerExtensionOptions](#wheatstalk-cdk-ecs-website-nginxproxycontainerextensionoptions)</code>)  *No description*
  * **defaultConf** (<code>string</code>)  Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload. 
  * **containerName** (<code>string</code>)  Name of the proxy container. __*Default*__: 'proxy'
  * **imageFrom** (<code>string</code>)  Provides an image name to build the nginx container from. __*Default*__: 'nginx:1'
  * **logging** (<code>[LogDriver](#aws-cdk-aws-ecs-logdriver)</code>)  Specifies the logging mechanism for the proxy container. __*Default*__: does not log
  * **trafficPort** (<code>number</code>)  Traffic port for the proxy. __*Default*__: 80



### Properties


Name | Type | Description 
-----|------|-------------
**options** | <code>[NginxProxyContainerExtensionOptions](#wheatstalk-cdk-ecs-website-nginxproxycontainerextensionoptions)</code> | <span></span>

### Methods


#### extend(taskDefinition) <a id="wheatstalk-cdk-ecs-website-nginxproxycontainerextension-extend"></a>

Apply the extension to the given TaskDefinition.

```ts
extend(taskDefinition: TaskDefinition): void
```

* **taskDefinition** (<code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code>)  *No description*






## class WebsiteService  <a id="wheatstalk-cdk-ecs-website-websiteservice"></a>

Create a website from an http-serving container.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)
__Extends__: [WebsiteServiceBase](#wheatstalk-cdk-ecs-website-websiteservicebase)

### Initializer




```ts
new WebsiteService(scope: Construct, id: string, props: WebsiteServiceProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[WebsiteServiceProps](#wheatstalk-cdk-ecs-website-websiteserviceprops)</code>)  *No description*
  * **albBasePriority** (<code>number</code>)  The base priority from which to increment rule priorities. 
  * **albListener** (<code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code>)  The load balancer listener to attach the service to. 
  * **cluster** (<code>[ICluster](#aws-cdk-aws-ecs-icluster)</code>)  The ECS cluster to add the service to. 
  * **primaryHostName** (<code>string</code>)  The primary host name that this service will serve from and redirect to. 
  * **additionalServingHosts** (<code>Array<string></code>)  Additional host names to serve traffic on. __*Optional*__
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **nginxContainerConfig** (<code>string</code>)  Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload. __*Default*__: does not use a reverse proxy
  * **nginxContainerImageFrom** (<code>string</code>)  Provides an image name to build the nginx container from. __*Default*__: 'nginx:1'
  * **redirects** (<code>Array<[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)></code>)  Redirect listener rules. __*Optional*__
  * **containerImage** (<code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code>)  The container image. 
  * **containerPort** (<code>number</code>)  The port that serves traffic. __*Default*__: 80
  * **envSecrets** (<code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code>)  Specify environment variables from secrets for the main container. __*Optional*__
  * **envVars** (<code>Map<string, string></code>)  Specify environment variables for the main container. __*Optional*__




## class WebsiteServiceBase  <a id="wheatstalk-cdk-ecs-website-websiteservicebase"></a>

Base class for the builder-style website service classes.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new WebsiteServiceBase(scope: Construct, id: string, props: WebsiteServiceBaseProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[WebsiteServiceBaseProps](#wheatstalk-cdk-ecs-website-websiteservicebaseprops)</code>)  *No description*
  * **albBasePriority** (<code>number</code>)  The base priority from which to increment rule priorities. 
  * **albListener** (<code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code>)  The load balancer listener to attach the service to. 
  * **cluster** (<code>[ICluster](#aws-cdk-aws-ecs-icluster)</code>)  The ECS cluster to add the service to. 
  * **primaryHostName** (<code>string</code>)  The primary host name that this service will serve from and redirect to. 
  * **additionalServingHosts** (<code>Array<string></code>)  Additional host names to serve traffic on. __*Optional*__
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **nginxContainerConfig** (<code>string</code>)  Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload. __*Default*__: does not use a reverse proxy
  * **nginxContainerImageFrom** (<code>string</code>)  Provides an image name to build the nginx container from. __*Default*__: 'nginx:1'
  * **redirects** (<code>Array<[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)></code>)  Redirect listener rules. __*Optional*__
  * **ecsExtension** (<code>[IEcsWorkload](#wheatstalk-cdk-ecs-website-iecsworkload)</code>)  Workload extension. 



### Properties


Name | Type | Description 
-----|------|-------------
**service** | <code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | The service instance.
**taskDefinition** | <code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code> | The task definition of the service.

### Methods


#### addRedirectResponse(hostHeader, redirectResponse) <a id="wheatstalk-cdk-ecs-website-websiteservicebase-addredirectresponse"></a>

Add a host name from which traffic will be redirected to another URL.

```ts
addRedirectResponse(hostHeader: string, redirectResponse: RedirectOptions): void
```

* **hostHeader** (<code>string</code>)  *No description*
* **redirectResponse** (<code>[RedirectOptions](#aws-cdk-aws-elasticloadbalancingv2-redirectoptions)</code>)  *No description*
  * **host** (<code>string</code>)  The hostname. __*Default*__: No change
  * **path** (<code>string</code>)  The absolute path, starting with the leading "/". __*Default*__: No change
  * **permanent** (<code>boolean</code>)  The HTTP redirect code. __*Default*__: false
  * **port** (<code>string</code>)  The port. __*Default*__: No change
  * **protocol** (<code>string</code>)  The protocol. __*Default*__: No change
  * **query** (<code>string</code>)  The query parameters, URL-encoded when necessary, but not percent-encoded. __*Default*__: No change




#### addRedirectToPrimaryHostName(hostHeader) <a id="wheatstalk-cdk-ecs-website-websiteservicebase-addredirecttoprimaryhostname"></a>

Add a host name from which traffic will be directed to the primary host name of the `IWebsiteService`.

```ts
addRedirectToPrimaryHostName(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*




#### addServingHost(hostHeader) <a id="wheatstalk-cdk-ecs-website-websiteservicebase-addservinghost"></a>

Add a host name on which traffic will be served.

```ts
addServingHost(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*






## class WordpressService  <a id="wheatstalk-cdk-ecs-website-wordpressservice"></a>

Create a wordpress website.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)
__Extends__: [WebsiteServiceBase](#wheatstalk-cdk-ecs-website-websiteservicebase)

### Initializer




```ts
new WordpressService(scope: Construct, id: string, props: WordpressServiceProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[WordpressServiceProps](#wheatstalk-cdk-ecs-website-wordpressserviceprops)</code>)  *No description*
  * **albBasePriority** (<code>number</code>)  The base priority from which to increment rule priorities. 
  * **albListener** (<code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code>)  The load balancer listener to attach the service to. 
  * **cluster** (<code>[ICluster](#aws-cdk-aws-ecs-icluster)</code>)  The ECS cluster to add the service to. 
  * **primaryHostName** (<code>string</code>)  The primary host name that this service will serve from and redirect to. 
  * **additionalServingHosts** (<code>Array<string></code>)  Additional host names to serve traffic on. __*Optional*__
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **nginxContainerConfig** (<code>string</code>)  Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload. __*Default*__: does not use a reverse proxy
  * **nginxContainerImageFrom** (<code>string</code>)  Provides an image name to build the nginx container from. __*Default*__: 'nginx:1'
  * **redirects** (<code>Array<[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)></code>)  Redirect listener rules. __*Optional*__
  * **databaseSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  Credentials for accessing the database server. 
  * **fileSystem** (<code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code>)  A filesystem in which to put the user uploads. 
  * **databaseConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database. __*Optional*__
  * **envSecrets** (<code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code>)  Specify environment variables from secrets for the main container. __*Optional*__
  * **envVars** (<code>Map<string, string></code>)  Specify environment variables for the main container. __*Optional*__
  * **fileSystemConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system. __*Optional*__
  * **fileSystemRootDirectory** (<code>string</code>)  A location on the filesystem to mount as the data volume root. __*Default*__: '/'
  * **wordpressDatabaseName** (<code>string</code>)  Name of the database containing the Wordpress site. __*Optional*__
  * **wordpressImageOptions** (<code>[WordpressImageOptions](#wheatstalk-cdk-ecs-website-wordpressimageoptions)</code>)  Options building the Wordpress container. __*Optional*__




## struct CognitoAuthenticationConfig  <a id="wheatstalk-cdk-ecs-website-cognitoauthenticationconfig"></a>


Configuration for authentication through a Cognito user pool.



Name | Type | Description 
-----|------|-------------
**domain** | <code>string</code> | Domain name of the Cognito user pool IdP.
**userPool** | <code>[IUserPool](#aws-cdk-aws-cognito-iuserpool)</code> | The Cognito user pool to identify against.



## struct EcsWorkloadServiceInfo  <a id="wheatstalk-cdk-ecs-website-ecsworkloadserviceinfo"></a>


Provides information to `IEcsWorkload.useService` about the service.



Name | Type | Description 
-----|------|-------------
**service** | <code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | <span></span>



## struct EcsWorkloadTaskInfo  <a id="wheatstalk-cdk-ecs-website-ecsworkloadtaskinfo"></a>


Provides information to `IEcsWorkload.useTaskDefinition` about the task definition.



Name | Type | Description 
-----|------|-------------
**taskDefinition** | <code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code> | The task definition.
**taskMemoryLimit** | <code>number</code> | The memory limit of the task definition.
**taskMemoryReserved** | <code>number</code> | The memory reservation of the task definition.



## struct HttpContainerWorkloadOptions  <a id="wheatstalk-cdk-ecs-website-httpcontainerworkloadoptions"></a>


Props for `HttpContainerWorkload`.



Name | Type | Description 
-----|------|-------------
**containerImage** | <code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code> | The container image.
**containerPort**? | <code>number</code> | The port that serves traffic.<br/>__*Default*__: 80
**envSecrets**? | <code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code> | Specify environment variables from secrets for the main container.<br/>__*Optional*__
**envVars**? | <code>Map<string, string></code> | Specify environment variables for the main container.<br/>__*Optional*__



## interface IEcsWorkload  <a id="wheatstalk-cdk-ecs-website-iecsworkload"></a>


Rough compatibility interface.

### Properties


Name | Type | Description 
-----|------|-------------
**trafficContainer** | <code>string</code> | <span></span>
**trafficPort** | <code>number</code> | <span></span>

### Methods


#### useService(service) <a id="wheatstalk-cdk-ecs-website-iecsworkload-useservice"></a>



```ts
useService(service: Ec2Service &#124; FargateService): void
```

* **service** (<code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code>)  *No description*




#### useTaskDefinition(taskDefinitionInfo) <a id="wheatstalk-cdk-ecs-website-iecsworkload-usetaskdefinition"></a>



```ts
useTaskDefinition(taskDefinitionInfo: EcsWorkloadTaskInfo): void
```

* **taskDefinitionInfo** (<code>[EcsWorkloadTaskInfo](#wheatstalk-cdk-ecs-website-ecsworkloadtaskinfo)</code>)  *No description*
  * **taskDefinition** (<code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code>)  The task definition. 
  * **taskMemoryLimit** (<code>number</code>)  The memory limit of the task definition. 
  * **taskMemoryReserved** (<code>number</code>)  The memory reservation of the task definition. 






## interface IWebsiteService  <a id="wheatstalk-cdk-ecs-website-iwebsiteservice"></a>

__Implemented by__: [WebsiteService](#wheatstalk-cdk-ecs-website-websiteservice), [WebsiteServiceBase](#wheatstalk-cdk-ecs-website-websiteservicebase), [WordpressService](#wheatstalk-cdk-ecs-website-wordpressservice)

A builder-pattern website service.
### Methods


#### addRedirectResponse(hostHeader, redirectResponse) <a id="wheatstalk-cdk-ecs-website-iwebsiteservice-addredirectresponse"></a>

Add a host name from which traffic will be redirected to another URL.

```ts
addRedirectResponse(hostHeader: string, redirectResponse: RedirectOptions): void
```

* **hostHeader** (<code>string</code>)  *No description*
* **redirectResponse** (<code>[RedirectOptions](#aws-cdk-aws-elasticloadbalancingv2-redirectoptions)</code>)  *No description*
  * **host** (<code>string</code>)  The hostname. __*Default*__: No change
  * **path** (<code>string</code>)  The absolute path, starting with the leading "/". __*Default*__: No change
  * **permanent** (<code>boolean</code>)  The HTTP redirect code. __*Default*__: false
  * **port** (<code>string</code>)  The port. __*Default*__: No change
  * **protocol** (<code>string</code>)  The protocol. __*Default*__: No change
  * **query** (<code>string</code>)  The query parameters, URL-encoded when necessary, but not percent-encoded. __*Default*__: No change




#### addRedirectToPrimaryHostName(hostHeader) <a id="wheatstalk-cdk-ecs-website-iwebsiteservice-addredirecttoprimaryhostname"></a>

Add a host name from which traffic will be directed to the primary host name of the `IWebsiteService`.

```ts
addRedirectToPrimaryHostName(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*




#### addServingHost(hostHeader) <a id="wheatstalk-cdk-ecs-website-iwebsiteservice-addservinghost"></a>

Add a host name on which traffic will be served.

```ts
addServingHost(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*






## struct ListenerRulesBuilderProps  <a id="wheatstalk-cdk-ecs-website-listenerrulesbuilderprops"></a>


Props for `ListenerRulesBuilder`.



Name | Type | Description 
-----|------|-------------
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The ALB listener to add listener rules to.
**albPriority** | <code>[ListenerRulePriorities](#wheatstalk-cdk-ecs-website-listenerrulepriorities)</code> | The strategy for allocating alb listener rule priorities.
**primaryHostName** | <code>string</code> | The primary host name to redirect to.
**service** | <code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | ECS service serving traffic.
**trafficContainerName** | <code>string</code> | Container to direct traffic to.
**trafficPort** | <code>number</code> | Port that the container listens on.



## struct NginxProxyContainerExtensionOptions 🔹 <a id="wheatstalk-cdk-ecs-website-nginxproxycontainerextensionoptions"></a>


Options for `NginxProxyContainerExtension`.



Name | Type | Description 
-----|------|-------------
**defaultConf**🔹 | <code>string</code> | Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload.
**containerName**?🔹 | <code>string</code> | Name of the proxy container.<br/>__*Default*__: 'proxy'
**imageFrom**?🔹 | <code>string</code> | Provides an image name to build the nginx container from.<br/>__*Default*__: 'nginx:1'
**logging**?🔹 | <code>[LogDriver](#aws-cdk-aws-ecs-logdriver)</code> | Specifies the logging mechanism for the proxy container.<br/>__*Default*__: does not log
**trafficPort**?🔹 | <code>number</code> | Traffic port for the proxy.<br/>__*Default*__: 80



## struct WebsiteHostRedirect  <a id="wheatstalk-cdk-ecs-website-websitehostredirect"></a>


A redirect.



Name | Type | Description 
-----|------|-------------
**hostHeader** | <code>string</code> | Host header to match on.
**redirect**? | <code>[RedirectOptions](#aws-cdk-aws-elasticloadbalancingv2-redirectoptions)</code> | Details of the redirection.<br/>__*Optional*__



## struct WebsiteServiceBaseProps  <a id="wheatstalk-cdk-ecs-website-websiteservicebaseprops"></a>


Props for `WebsiteServiceBase`.



Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**ecsExtension** | <code>[IEcsWorkload](#wheatstalk-cdk-ecs-website-iecsworkload)</code> | Workload extension.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**additionalServingHosts**? | <code>Array<string></code> | Additional host names to serve traffic on.<br/>__*Optional*__
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
**nginxContainerConfig**?🔹 | <code>string</code> | Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload.<br/>__*Default*__: does not use a reverse proxy
**nginxContainerImageFrom**?🔹 | <code>string</code> | Provides an image name to build the nginx container from.<br/>__*Default*__: 'nginx:1'
**redirects**? | <code>Array<[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)></code> | Redirect listener rules.<br/>__*Optional*__



## struct WebsiteServiceOptions  <a id="wheatstalk-cdk-ecs-website-websiteserviceoptions"></a>


Non-workload options for `WebsiteServiceBase`.



Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**additionalServingHosts**? | <code>Array<string></code> | Additional host names to serve traffic on.<br/>__*Optional*__
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
**nginxContainerConfig**?🔹 | <code>string</code> | Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload.<br/>__*Default*__: does not use a reverse proxy
**nginxContainerImageFrom**?🔹 | <code>string</code> | Provides an image name to build the nginx container from.<br/>__*Default*__: 'nginx:1'
**redirects**? | <code>Array<[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)></code> | Redirect listener rules.<br/>__*Optional*__



## struct WebsiteServiceProps  <a id="wheatstalk-cdk-ecs-website-websiteserviceprops"></a>


Props for `WebsiteService`.



Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**containerImage** | <code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code> | The container image.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**additionalServingHosts**? | <code>Array<string></code> | Additional host names to serve traffic on.<br/>__*Optional*__
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**containerPort**? | <code>number</code> | The port that serves traffic.<br/>__*Default*__: 80
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
**envSecrets**? | <code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code> | Specify environment variables from secrets for the main container.<br/>__*Optional*__
**envVars**? | <code>Map<string, string></code> | Specify environment variables for the main container.<br/>__*Optional*__
**nginxContainerConfig**?🔹 | <code>string</code> | Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload.<br/>__*Default*__: does not use a reverse proxy
**nginxContainerImageFrom**?🔹 | <code>string</code> | Provides an image name to build the nginx container from.<br/>__*Default*__: 'nginx:1'
**redirects**? | <code>Array<[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)></code> | Redirect listener rules.<br/>__*Optional*__



## struct WebsiteServicePropsAuthWithUserPoolProps ⚠️ <a id="wheatstalk-cdk-ecs-website-websiteservicepropsauthwithuserpoolprops"></a>






Name | Type | Description 
-----|------|-------------
**domain**⚠️ | <code>string</code> | Domain name of the Cognito user pool IdP.
**userPool**⚠️ | <code>[IUserPool](#aws-cdk-aws-cognito-iuserpool)</code> | The Cognito user pool to identify against.



## struct WordpressImageOptions  <a id="wheatstalk-cdk-ecs-website-wordpressimageoptions"></a>


Configuration options for building the WordPress container image.



Name | Type | Description 
-----|------|-------------
**from**? | <code>string</code> | PHP container to build the container from.<br/>__*Default*__: 'php:7-apache'
**wordpressSourcePath**? | <code>string</code> | Provide your own WordPress sources.<br/>__*Optional*__
**wordpressVersion**? | <code>string</code> | Provide a WordPress version to download.<br/>__*Default*__: 'latest'



## struct WordpressServiceProps  <a id="wheatstalk-cdk-ecs-website-wordpressserviceprops"></a>


Props for `WordpressService`.



Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**databaseSecret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | Credentials for accessing the database server.
**fileSystem** | <code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code> | A filesystem in which to put the user uploads.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**additionalServingHosts**? | <code>Array<string></code> | Additional host names to serve traffic on.<br/>__*Optional*__
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**databaseConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database.<br/>__*Optional*__
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
**envSecrets**? | <code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code> | Specify environment variables from secrets for the main container.<br/>__*Optional*__
**envVars**? | <code>Map<string, string></code> | Specify environment variables for the main container.<br/>__*Optional*__
**fileSystemConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system.<br/>__*Optional*__
**fileSystemRootDirectory**? | <code>string</code> | A location on the filesystem to mount as the data volume root.<br/>__*Default*__: '/'
**nginxContainerConfig**?🔹 | <code>string</code> | Provides `default.conf` configuration for an nginx container that is added to the task as the default, traffic-serving container. You may use this feature to create a reverse proxy for your workload.<br/>__*Default*__: does not use a reverse proxy
**nginxContainerImageFrom**?🔹 | <code>string</code> | Provides an image name to build the nginx container from.<br/>__*Default*__: 'nginx:1'
**redirects**? | <code>Array<[WebsiteHostRedirect](#wheatstalk-cdk-ecs-website-websitehostredirect)></code> | Redirect listener rules.<br/>__*Optional*__
**wordpressDatabaseName**? | <code>string</code> | Name of the database containing the Wordpress site.<br/>__*Optional*__
**wordpressImageOptions**? | <code>[WordpressImageOptions](#wheatstalk-cdk-ecs-website-wordpressimageoptions)</code> | Options building the Wordpress container.<br/>__*Optional*__



## struct WordpressWorkloadOptions  <a id="wheatstalk-cdk-ecs-website-wordpressworkloadoptions"></a>


Props for `WordpressWorkload`.



Name | Type | Description 
-----|------|-------------
**databaseSecret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | Credentials for accessing the database server.
**fileSystem** | <code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code> | A filesystem in which to put the user uploads.
**databaseConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database.<br/>__*Optional*__
**envSecrets**? | <code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code> | Specify environment variables from secrets for the main container.<br/>__*Optional*__
**envVars**? | <code>Map<string, string></code> | Specify environment variables for the main container.<br/>__*Optional*__
**fileSystemConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system.<br/>__*Optional*__
**fileSystemRootDirectory**? | <code>string</code> | A location on the filesystem to mount as the data volume root.<br/>__*Default*__: '/'
**wordpressDatabaseName**? | <code>string</code> | Name of the database containing the Wordpress site.<br/>__*Optional*__
**wordpressImageOptions**? | <code>[WordpressImageOptions](#wheatstalk-cdk-ecs-website-wordpressimageoptions)</code> | Options building the Wordpress container.<br/>__*Optional*__



## enum EcsWorkloadCapacityType  <a id="wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype"></a>

Type of capacity to use.

Name | Description
-----|-----
**EC2** |
**FARGATE** |


