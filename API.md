# API Reference

**Classes**

Name|Description
----|-----------
[EcsExtensionService](#wheatstalk-cdk-ecs-website-ecsextensionservice)|Creates an EC2 or Fargate service from an `IEcsExtension`.
[HttpContainerExtension](#wheatstalk-cdk-ecs-website-httpcontainerextension)|Provides a simple HTTP-serving container as a service workload.
[WebsiteService](#wheatstalk-cdk-ecs-website-websiteservice)|Create a website service.
[WebsiteServiceBase](#wheatstalk-cdk-ecs-website-websiteservicebase)|Base class for the builder-style website service classes.
[WordpressExtension](#wheatstalk-cdk-ecs-website-wordpressextension)|Provides an opinionated ECS-hosted website workload.
[WordpressService](#wheatstalk-cdk-ecs-website-wordpressservice)|Create a website service.


**Structs**

Name|Description
----|-----------
[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)|*No description*
[CreateImageOptions](#wheatstalk-cdk-ecs-website-createimageoptions)|Configuration options for building the WordPress container image.
[DefaultingRedirectResponse](#wheatstalk-cdk-ecs-website-defaultingredirectresponse)|*No description*
[EcsExtensionServiceProps](#wheatstalk-cdk-ecs-website-ecsextensionserviceprops)|Props for `EcsExtensionService`.
[HttpContainerExtensionProps](#wheatstalk-cdk-ecs-website-httpcontainerextensionprops)|Props for `HttpContainerExtension`.
[ListenerRulesBuilderProps](#wheatstalk-cdk-ecs-website-listenerrulesbuilderprops)|*No description*
[ServiceBindingInfo](#wheatstalk-cdk-ecs-website-servicebindinginfo)|Provides information to `IEcsExtension.useService` about the service.
[TaskDefinitionBindingInfo](#wheatstalk-cdk-ecs-website-taskdefinitionbindinginfo)|Provides information to `IEcsExtension.useTaskDefinition` about the task definition.
[WebsiteServiceBaseProps](#wheatstalk-cdk-ecs-website-websiteservicebaseprops)|Props for `WebsiteServiceBase`.
[WebsiteServiceOptions](#wheatstalk-cdk-ecs-website-websiteserviceoptions)|Non-workload options for `WebsiteServiceBase`.
[WebsiteServiceProps](#wheatstalk-cdk-ecs-website-websiteserviceprops)|*No description*
[WordpressExtensionOptions](#wheatstalk-cdk-ecs-website-wordpressextensionoptions)|Props for `WordpressExtension`.
[WordpressServiceProps](#wheatstalk-cdk-ecs-website-wordpressserviceprops)|*No description*


**Interfaces**

Name|Description
----|-----------
[IEcsExtension](#wheatstalk-cdk-ecs-website-iecsextension)|Rough compatibility interface.
[IEcsServicePattern](#wheatstalk-cdk-ecs-website-iecsservicepattern)|Interface for the pattern of creating ECS task definitions and services.
[IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)|A builder-pattern website service.


**Enums**

Name|Description
----|-----------
[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)|Type of capacity to use.
[RedirectResponseStatus](#wheatstalk-cdk-ecs-website-redirectresponsestatus)|*No description*



## class EcsExtensionService  <a id="wheatstalk-cdk-ecs-website-ecsextensionservice"></a>

Creates an EC2 or Fargate service from an `IEcsExtension`.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new EcsExtensionService(scope: Construct, id: string, props: EcsExtensionServiceProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[EcsExtensionServiceProps](#wheatstalk-cdk-ecs-website-ecsextensionserviceprops)</code>)  *No description*
  * **cluster** (<code>[ICluster](#aws-cdk-aws-ecs-icluster)</code>)  *No description* 
  * **serviceExtension** (<code>[IEcsExtension](#wheatstalk-cdk-ecs-website-iecsextension)</code>)  *No description* 
  * **capacityType** (<code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code>)  *No description* __*Optional*__
  * **cpuMinimum** (<code>number</code>)  Minimum cpu required. __*Default*__: no reservation
  * **desiredCount** (<code>number</code>)  Desired number of tasks. __*Default*__: 1
  * **memoryLimit** (<code>number</code>)  Maximum memory allowed before task is killed. __*Default*__: 512
  * **memoryReserved** (<code>number</code>)  Memory reservation required to schedule. __*Default*__: 64
  * **networkMode** (<code>[NetworkMode](#aws-cdk-aws-ecs-networkmode)</code>)  Requested network mode. __*Default*__: When ec2, BRIDGED, otherwise AWS_VPC



### Properties


Name | Type | Description 
-----|------|-------------
**containerName** | <code>string</code> | <span></span>
**service** | <code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | <span></span>
**trafficPort** | <code>number</code> | <span></span>



## class HttpContainerExtension  <a id="wheatstalk-cdk-ecs-website-httpcontainerextension"></a>

Provides a simple HTTP-serving container as a service workload.

__Implements__: [IEcsExtension](#wheatstalk-cdk-ecs-website-iecsextension)

### Initializer




```ts
new HttpContainerExtension(props: HttpContainerExtensionProps)
```

* **props** (<code>[HttpContainerExtensionProps](#wheatstalk-cdk-ecs-website-httpcontainerextensionprops)</code>)  *No description*
  * **containerImage** (<code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code>)  The container image. 
  * **envSecrets** (<code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code>)  Specify environment variables from secrets for the main container. __*Optional*__
  * **envVars** (<code>Map<string, string></code>)  Specify environment variables for the main container. __*Optional*__
  * **trafficPort** (<code>number</code>)  The port that serves traffic. __*Default*__: 80



### Properties


Name | Type | Description 
-----|------|-------------
**trafficContainer** | <code>string</code> | <span></span>
**trafficPort** | <code>number</code> | <span></span>

### Methods


#### useService(_service) <a id="wheatstalk-cdk-ecs-website-httpcontainerextension-useservice"></a>



```ts
useService(_service: Ec2Service &#124; FargateService): void
```

* **_service** (<code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code>)  *No description*




#### useTaskDefinition(taskDefinitionInfo) <a id="wheatstalk-cdk-ecs-website-httpcontainerextension-usetaskdefinition"></a>



```ts
useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void
```

* **taskDefinitionInfo** (<code>[TaskDefinitionBindingInfo](#wheatstalk-cdk-ecs-website-taskdefinitionbindinginfo)</code>)  *No description*
  * **taskDefinition** (<code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code>)  The task definition. 
  * **taskMemoryLimit** (<code>number</code>)  The memory limit of the task definition. 
  * **taskMemoryReserved** (<code>number</code>)  The memory reservation of the task definition. 






## class WebsiteService  <a id="wheatstalk-cdk-ecs-website-websiteservice"></a>

Create a website service.

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
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **containerImage** (<code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code>)  The main container image. 
  * **containerPort** (<code>number</code>)  The the main container port to expose by load balancer. __*Default*__: 80
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
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **ecsExtension** (<code>[IEcsExtension](#wheatstalk-cdk-ecs-website-iecsextension)</code>)  Workload extension. 


### Methods


#### addRedirectResponse(hostHeader, redirectResponse) <a id="wheatstalk-cdk-ecs-website-websiteservicebase-addredirectresponse"></a>

Add a host name from which traffic will be redirected to another URL.

```ts
addRedirectResponse(hostHeader: string, redirectResponse: DefaultingRedirectResponse): void
```

* **hostHeader** (<code>string</code>)  *No description*
* **redirectResponse** (<code>[DefaultingRedirectResponse](#wheatstalk-cdk-ecs-website-defaultingredirectresponse)</code>)  *No description*
  * **host** (<code>string</code>)  *No description* __*Optional*__
  * **path** (<code>string</code>)  *No description* __*Optional*__
  * **port** (<code>string</code>)  *No description* __*Optional*__
  * **protocol** (<code>string</code>)  *No description* __*Optional*__
  * **query** (<code>string</code>)  *No description* __*Optional*__
  * **statusCode** (<code>[RedirectResponseStatus](#wheatstalk-cdk-ecs-website-redirectresponsestatus)</code>)  *No description* __*Optional*__




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






## class WordpressExtension  <a id="wheatstalk-cdk-ecs-website-wordpressextension"></a>

Provides an opinionated ECS-hosted website workload.

__Implements__: [IEcsExtension](#wheatstalk-cdk-ecs-website-iecsextension)

### Initializer




```ts
new WordpressExtension(props: WordpressExtensionOptions)
```

* **props** (<code>[WordpressExtensionOptions](#wheatstalk-cdk-ecs-website-wordpressextensionoptions)</code>)  *No description*
  * **databaseSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  Credentials for accessing the database server. 
  * **fileSystem** (<code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code>)  A filesystem in which to put the user uploads. 
  * **databaseConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database. __*Optional*__
  * **fileSystemConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system. __*Optional*__
  * **fileSystemRootDirectory** (<code>string</code>)  A location on the filesystem to mount as the data volume root. __*Default*__: '/'
  * **wordpressDatabaseName** (<code>string</code>)  Name of the database containing the Wordpress site. __*Optional*__
  * **wordpressImageOptions** (<code>[CreateImageOptions](#wheatstalk-cdk-ecs-website-createimageoptions)</code>)  Options building the Wordpress container. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**trafficContainer** | <code>string</code> | <span></span>
**trafficPort** | <code>number</code> | <span></span>

### Methods


#### useService(service) <a id="wheatstalk-cdk-ecs-website-wordpressextension-useservice"></a>



```ts
useService(service: Ec2Service &#124; FargateService): void
```

* **service** (<code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code>)  *No description*




#### useTaskDefinition(taskDefinitionInfo) <a id="wheatstalk-cdk-ecs-website-wordpressextension-usetaskdefinition"></a>



```ts
useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void
```

* **taskDefinitionInfo** (<code>[TaskDefinitionBindingInfo](#wheatstalk-cdk-ecs-website-taskdefinitionbindinginfo)</code>)  *No description*
  * **taskDefinition** (<code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code>)  The task definition. 
  * **taskMemoryLimit** (<code>number</code>)  The memory limit of the task definition. 
  * **taskMemoryReserved** (<code>number</code>)  The memory reservation of the task definition. 






## class WordpressService  <a id="wheatstalk-cdk-ecs-website-wordpressservice"></a>

Create a website service.

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
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **databaseSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  Credentials for accessing the database server. 
  * **fileSystem** (<code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code>)  A filesystem in which to put the user uploads. 
  * **databaseConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database. __*Optional*__
  * **fileSystemConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system. __*Optional*__
  * **fileSystemRootDirectory** (<code>string</code>)  A location on the filesystem to mount as the data volume root. __*Default*__: '/'
  * **wordpressDatabaseName** (<code>string</code>)  Name of the database containing the Wordpress site. __*Optional*__
  * **wordpressImageOptions** (<code>[CreateImageOptions](#wheatstalk-cdk-ecs-website-createimageoptions)</code>)  Options building the Wordpress container. __*Optional*__




## struct AuthWithUserPoolProps  <a id="wheatstalk-cdk-ecs-website-authwithuserpoolprops"></a>






Name | Type | Description 
-----|------|-------------
**domain** | <code>string</code> | <span></span>
**userPool** | <code>[IUserPool](#aws-cdk-aws-cognito-iuserpool)</code> | <span></span>



## struct CreateImageOptions  <a id="wheatstalk-cdk-ecs-website-createimageoptions"></a>


Configuration options for building the WordPress container image.



Name | Type | Description 
-----|------|-------------
**from**? | <code>string</code> | PHP container to build the container from.<br/>__*Default*__: 'php:7-apache'
**wordpressSourcePath**? | <code>string</code> | Provide your own WordPress sources.<br/>__*Optional*__
**wordpressVersion**? | <code>string</code> | Provide a WordPress version to download.<br/>__*Default*__: 'latest'



## struct DefaultingRedirectResponse  <a id="wheatstalk-cdk-ecs-website-defaultingredirectresponse"></a>






Name | Type | Description 
-----|------|-------------
**host**? | <code>string</code> | __*Optional*__
**path**? | <code>string</code> | __*Optional*__
**port**? | <code>string</code> | __*Optional*__
**protocol**? | <code>string</code> | __*Optional*__
**query**? | <code>string</code> | __*Optional*__
**statusCode**? | <code>[RedirectResponseStatus](#wheatstalk-cdk-ecs-website-redirectresponsestatus)</code> | __*Optional*__



## struct EcsExtensionServiceProps  <a id="wheatstalk-cdk-ecs-website-ecsextensionserviceprops"></a>


Props for `EcsExtensionService`.



Name | Type | Description 
-----|------|-------------
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | <span></span>
**serviceExtension** | <code>[IEcsExtension](#wheatstalk-cdk-ecs-website-iecsextension)</code> | <span></span>
**capacityType**? | <code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code> | __*Optional*__
**cpuMinimum**? | <code>number</code> | Minimum cpu required.<br/>__*Default*__: no reservation
**desiredCount**? | <code>number</code> | Desired number of tasks.<br/>__*Default*__: 1
**memoryLimit**? | <code>number</code> | Maximum memory allowed before task is killed.<br/>__*Default*__: 512
**memoryReserved**? | <code>number</code> | Memory reservation required to schedule.<br/>__*Default*__: 64
**networkMode**? | <code>[NetworkMode](#aws-cdk-aws-ecs-networkmode)</code> | Requested network mode.<br/>__*Default*__: When ec2, BRIDGED, otherwise AWS_VPC



## struct HttpContainerExtensionProps  <a id="wheatstalk-cdk-ecs-website-httpcontainerextensionprops"></a>


Props for `HttpContainerExtension`.



Name | Type | Description 
-----|------|-------------
**containerImage** | <code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code> | The container image.
**envSecrets**? | <code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code> | Specify environment variables from secrets for the main container.<br/>__*Optional*__
**envVars**? | <code>Map<string, string></code> | Specify environment variables for the main container.<br/>__*Optional*__
**trafficPort**? | <code>number</code> | The port that serves traffic.<br/>__*Default*__: 80



## interface IEcsExtension  <a id="wheatstalk-cdk-ecs-website-iecsextension"></a>

__Implemented by__: [HttpContainerExtension](#wheatstalk-cdk-ecs-website-httpcontainerextension), [WordpressExtension](#wheatstalk-cdk-ecs-website-wordpressextension)

Rough compatibility interface.

### Properties


Name | Type | Description 
-----|------|-------------
**trafficContainer** | <code>string</code> | <span></span>
**trafficPort** | <code>number</code> | <span></span>

### Methods


#### useService(service) <a id="wheatstalk-cdk-ecs-website-iecsextension-useservice"></a>



```ts
useService(service: Ec2Service &#124; FargateService): void
```

* **service** (<code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code>)  *No description*




#### useTaskDefinition(taskDefinitionInfo) <a id="wheatstalk-cdk-ecs-website-iecsextension-usetaskdefinition"></a>



```ts
useTaskDefinition(taskDefinitionInfo: TaskDefinitionBindingInfo): void
```

* **taskDefinitionInfo** (<code>[TaskDefinitionBindingInfo](#wheatstalk-cdk-ecs-website-taskdefinitionbindinginfo)</code>)  *No description*
  * **taskDefinition** (<code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code>)  The task definition. 
  * **taskMemoryLimit** (<code>number</code>)  The memory limit of the task definition. 
  * **taskMemoryReserved** (<code>number</code>)  The memory reservation of the task definition. 






## interface IEcsServicePattern  <a id="wheatstalk-cdk-ecs-website-iecsservicepattern"></a>


Interface for the pattern of creating ECS task definitions and services.
### Methods


#### bindService(scope, cluster, taskDefinitionBinding) <a id="wheatstalk-cdk-ecs-website-iecsservicepattern-bindservice"></a>



```ts
bindService(scope: Construct, cluster: ICluster, taskDefinitionBinding: TaskDefinitionBindingInfo): ServiceBindingInfo
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **cluster** (<code>[ICluster](#aws-cdk-aws-ecs-icluster)</code>)  *No description*
* **taskDefinitionBinding** (<code>[TaskDefinitionBindingInfo](#wheatstalk-cdk-ecs-website-taskdefinitionbindinginfo)</code>)  *No description*
  * **taskDefinition** (<code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code>)  The task definition. 
  * **taskMemoryLimit** (<code>number</code>)  The memory limit of the task definition. 
  * **taskMemoryReserved** (<code>number</code>)  The memory reservation of the task definition. 

__Returns__:
* <code>[ServiceBindingInfo](#wheatstalk-cdk-ecs-website-servicebindinginfo)</code>

#### bindTaskDefinition(scope, cluster) <a id="wheatstalk-cdk-ecs-website-iecsservicepattern-bindtaskdefinition"></a>



```ts
bindTaskDefinition(scope: Construct, cluster: ICluster): TaskDefinitionBindingInfo
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **cluster** (<code>[ICluster](#aws-cdk-aws-ecs-icluster)</code>)  *No description*

__Returns__:
* <code>[TaskDefinitionBindingInfo](#wheatstalk-cdk-ecs-website-taskdefinitionbindinginfo)</code>



## interface IWebsiteService  <a id="wheatstalk-cdk-ecs-website-iwebsiteservice"></a>

__Implemented by__: [WebsiteService](#wheatstalk-cdk-ecs-website-websiteservice), [WebsiteServiceBase](#wheatstalk-cdk-ecs-website-websiteservicebase), [WordpressService](#wheatstalk-cdk-ecs-website-wordpressservice)

A builder-pattern website service.
### Methods


#### addRedirectResponse(hostHeader, redirectResponse) <a id="wheatstalk-cdk-ecs-website-iwebsiteservice-addredirectresponse"></a>

Add a host name from which traffic will be redirected to another URL.

```ts
addRedirectResponse(hostHeader: string, redirectResponse: DefaultingRedirectResponse): void
```

* **hostHeader** (<code>string</code>)  *No description*
* **redirectResponse** (<code>[DefaultingRedirectResponse](#wheatstalk-cdk-ecs-website-defaultingredirectresponse)</code>)  *No description*
  * **host** (<code>string</code>)  *No description* __*Optional*__
  * **path** (<code>string</code>)  *No description* __*Optional*__
  * **port** (<code>string</code>)  *No description* __*Optional*__
  * **protocol** (<code>string</code>)  *No description* __*Optional*__
  * **query** (<code>string</code>)  *No description* __*Optional*__
  * **statusCode** (<code>[RedirectResponseStatus](#wheatstalk-cdk-ecs-website-redirectresponsestatus)</code>)  *No description* __*Optional*__




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






Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | <span></span>
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | <span></span>
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | <span></span>
**containerName** | <code>string</code> | <span></span>
**primaryHostName** | <code>string</code> | <span></span>
**service** | <code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | <span></span>
**trafficPort** | <code>number</code> | <span></span>
**authWithUserPool**? | <code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code> | __*Optional*__



## struct ServiceBindingInfo  <a id="wheatstalk-cdk-ecs-website-servicebindinginfo"></a>


Provides information to `IEcsExtension.useService` about the service.



Name | Type | Description 
-----|------|-------------
**service** | <code>[Ec2Service](#aws-cdk-aws-ecs-ec2service) &#124; [FargateService](#aws-cdk-aws-ecs-fargateservice)</code> | <span></span>



## struct TaskDefinitionBindingInfo  <a id="wheatstalk-cdk-ecs-website-taskdefinitionbindinginfo"></a>


Provides information to `IEcsExtension.useTaskDefinition` about the task definition.



Name | Type | Description 
-----|------|-------------
**taskDefinition** | <code>[TaskDefinition](#aws-cdk-aws-ecs-taskdefinition)</code> | The task definition.
**taskMemoryLimit** | <code>number</code> | The memory limit of the task definition.
**taskMemoryReserved** | <code>number</code> | The memory reservation of the task definition.



## struct WebsiteServiceBaseProps  <a id="wheatstalk-cdk-ecs-website-websiteservicebaseprops"></a>


Props for `WebsiteServiceBase`.



Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**ecsExtension** | <code>[IEcsExtension](#wheatstalk-cdk-ecs-website-iecsextension)</code> | Workload extension.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1



## struct WebsiteServiceOptions  <a id="wheatstalk-cdk-ecs-website-websiteserviceoptions"></a>


Non-workload options for `WebsiteServiceBase`.



Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1



## struct WebsiteServiceProps  <a id="wheatstalk-cdk-ecs-website-websiteserviceprops"></a>






Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**containerImage** | <code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code> | The main container image.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**containerPort**? | <code>number</code> | The the main container port to expose by load balancer.<br/>__*Default*__: 80
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
**envSecrets**? | <code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code> | Specify environment variables from secrets for the main container.<br/>__*Optional*__
**envVars**? | <code>Map<string, string></code> | Specify environment variables for the main container.<br/>__*Optional*__



## struct WordpressExtensionOptions  <a id="wheatstalk-cdk-ecs-website-wordpressextensionoptions"></a>


Props for `WordpressExtension`.



Name | Type | Description 
-----|------|-------------
**databaseSecret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | Credentials for accessing the database server.
**fileSystem** | <code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code> | A filesystem in which to put the user uploads.
**databaseConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database.<br/>__*Optional*__
**fileSystemConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system.<br/>__*Optional*__
**fileSystemRootDirectory**? | <code>string</code> | A location on the filesystem to mount as the data volume root.<br/>__*Default*__: '/'
**wordpressDatabaseName**? | <code>string</code> | Name of the database containing the Wordpress site.<br/>__*Optional*__
**wordpressImageOptions**? | <code>[CreateImageOptions](#wheatstalk-cdk-ecs-website-createimageoptions)</code> | Options building the Wordpress container.<br/>__*Optional*__



## struct WordpressServiceProps  <a id="wheatstalk-cdk-ecs-website-wordpressserviceprops"></a>






Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**databaseSecret** | <code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code> | Credentials for accessing the database server.
**fileSystem** | <code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code> | A filesystem in which to put the user uploads.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[AuthWithUserPoolProps](#wheatstalk-cdk-ecs-website-authwithuserpoolprops)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsExtensionServiceCapacityType](#wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**databaseConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database.<br/>__*Optional*__
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
**fileSystemConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system.<br/>__*Optional*__
**fileSystemRootDirectory**? | <code>string</code> | A location on the filesystem to mount as the data volume root.<br/>__*Default*__: '/'
**wordpressDatabaseName**? | <code>string</code> | Name of the database containing the Wordpress site.<br/>__*Optional*__
**wordpressImageOptions**? | <code>[CreateImageOptions](#wheatstalk-cdk-ecs-website-createimageoptions)</code> | Options building the Wordpress container.<br/>__*Optional*__



## enum EcsExtensionServiceCapacityType  <a id="wheatstalk-cdk-ecs-website-ecsextensionservicecapacitytype"></a>

Type of capacity to use.

Name | Description
-----|-----
**EC2** |
**FARGATE** |


## enum RedirectResponseStatus  <a id="wheatstalk-cdk-ecs-website-redirectresponsestatus"></a>



Name | Description
-----|-----
**HTTP_301_PERMANENT** |
**HTTP_302_FOUND** |


