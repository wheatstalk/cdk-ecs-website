# API Reference

**Classes**

Name|Description
----|-----------
[WebsiteService](#wheatstalk-cdk-ecs-website-websiteservice)|Create a website from an http-serving container.
[WordpressService](#wheatstalk-cdk-ecs-website-wordpressservice)|Create a wordpress website.


**Structs**

Name|Description
----|-----------
[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)|Configuration for authentication through a Cognito user pool.
[WebsiteServiceProps](#wheatstalk-cdk-ecs-website-websiteserviceprops)|Props for `WebsiteService`.
[WordpressImageOptions](#wheatstalk-cdk-ecs-website-wordpressimageoptions)|Configuration options for building the WordPress container image.
[WordpressServiceProps](#wheatstalk-cdk-ecs-website-wordpressserviceprops)|Props for `WordpressService`.


**Interfaces**

Name|Description
----|-----------
[IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)|A builder-pattern website service.


**Enums**

Name|Description
----|-----------
[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)|Type of capacity to use.



## class WebsiteService  <a id="wheatstalk-cdk-ecs-website-websiteservice"></a>

Create a website from an http-serving container.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)
__Extends__: [Construct](#aws-cdk-core-construct)

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
  * **containerImage** (<code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code>)  The main container image. 
  * **primaryHostName** (<code>string</code>)  The primary host name that this service will serve from and redirect to. 
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **containerPort** (<code>number</code>)  The the main container port to expose by load balancer. __*Default*__: 80
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **envSecrets** (<code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code>)  Specify environment variables from secrets for the main container. __*Optional*__
  * **envVars** (<code>Map<string, string></code>)  Specify environment variables for the main container. __*Optional*__


### Methods


#### addRedirectResponse(hostHeader, redirectResponse) <a id="wheatstalk-cdk-ecs-website-websiteservice-addredirectresponse"></a>

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




#### addRedirectToPrimaryHostName(hostHeader) <a id="wheatstalk-cdk-ecs-website-websiteservice-addredirecttoprimaryhostname"></a>

Add a host name from which traffic will be directed to the primary host name of the `IWebsiteService`.

```ts
addRedirectToPrimaryHostName(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*




#### addServingHost(hostHeader) <a id="wheatstalk-cdk-ecs-website-websiteservice-addservinghost"></a>

Add a host name on which traffic will be served.

```ts
addServingHost(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*






## class WordpressService  <a id="wheatstalk-cdk-ecs-website-wordpressservice"></a>

Create a wordpress website.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IWebsiteService](#wheatstalk-cdk-ecs-website-iwebsiteservice)
__Extends__: [Construct](#aws-cdk-core-construct)

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
  * **databaseSecret** (<code>[ISecret](#aws-cdk-aws-secretsmanager-isecret)</code>)  Credentials for accessing the database server. 
  * **fileSystem** (<code>[IFileSystem](#aws-cdk-aws-efs-ifilesystem)</code>)  A filesystem in which to put the user uploads. 
  * **primaryHostName** (<code>string</code>)  The primary host name that this service will serve from and redirect to. 
  * **allowedConnections** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Allow others access to the traffic port. __*Optional*__
  * **authBypassHeaderValue** (<code>string</code>)  Provide a value that can be used to bypass authentication with headers. __*Optional*__
  * **authWithUserPool** (<code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code>)  Instruct the service to authenticate with the cognito user pool. __*Optional*__
  * **capacityType** (<code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code>)  Type of compute capacity. __*Default*__: EcsExtensionCapacityType.EC2
  * **connectToPeers** (<code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code>)  Register the service as allowed in others' ingresses. __*Optional*__
  * **databaseConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database. __*Optional*__
  * **desiredCount** (<code>number</code>)  Desired task count. __*Default*__: 1
  * **fileSystemConnection** (<code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code>)  When provided, an ingress rule will be added to the filesystem's security group so that ECS can mount the file system. __*Optional*__
  * **fileSystemRootDirectory** (<code>string</code>)  A location on the filesystem to mount as the data volume root. __*Default*__: '/'
  * **wordpressDatabaseName** (<code>string</code>)  Name of the database containing the Wordpress site. __*Optional*__
  * **wordpressImageOptions** (<code>[WordpressImageOptions](#wheatstalk-cdk-ecs-website-wordpressimageoptions)</code>)  Options building the Wordpress container. __*Optional*__


### Methods


#### addRedirectResponse(hostHeader, redirectResponse) <a id="wheatstalk-cdk-ecs-website-wordpressservice-addredirectresponse"></a>

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




#### addRedirectToPrimaryHostName(hostHeader) <a id="wheatstalk-cdk-ecs-website-wordpressservice-addredirecttoprimaryhostname"></a>

Add a host name from which traffic will be directed to the primary host name of the `IWebsiteService`.

```ts
addRedirectToPrimaryHostName(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*




#### addServingHost(hostHeader) <a id="wheatstalk-cdk-ecs-website-wordpressservice-addservinghost"></a>

Add a host name on which traffic will be served.

```ts
addServingHost(hostHeader: string): void
```

* **hostHeader** (<code>string</code>)  *No description*






## struct CognitoAuthenticationConfig  <a id="wheatstalk-cdk-ecs-website-cognitoauthenticationconfig"></a>


Configuration for authentication through a Cognito user pool.



Name | Type | Description 
-----|------|-------------
**domain** | <code>string</code> | <span></span>
**userPool** | <code>[IUserPool](#aws-cdk-aws-cognito-iuserpool)</code> | <span></span>



## interface IWebsiteService  <a id="wheatstalk-cdk-ecs-website-iwebsiteservice"></a>

__Implemented by__: [WebsiteService](#wheatstalk-cdk-ecs-website-websiteservice), [WordpressService](#wheatstalk-cdk-ecs-website-wordpressservice)

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






## struct WebsiteServiceProps  <a id="wheatstalk-cdk-ecs-website-websiteserviceprops"></a>


Props for `WebsiteService`.



Name | Type | Description 
-----|------|-------------
**albBasePriority** | <code>number</code> | The base priority from which to increment rule priorities.
**albListener** | <code>[IApplicationListener](#aws-cdk-aws-elasticloadbalancingv2-iapplicationlistener)</code> | The load balancer listener to attach the service to.
**cluster** | <code>[ICluster](#aws-cdk-aws-ecs-icluster)</code> | The ECS cluster to add the service to.
**containerImage** | <code>[ContainerImage](#aws-cdk-aws-ecs-containerimage)</code> | The main container image.
**primaryHostName** | <code>string</code> | The primary host name that this service will serve from and redirect to.
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**containerPort**? | <code>number</code> | The the main container port to expose by load balancer.<br/>__*Default*__: 80
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
**envSecrets**? | <code>Map<string, [Secret](#aws-cdk-aws-ecs-secret)></code> | Specify environment variables from secrets for the main container.<br/>__*Optional*__
**envVars**? | <code>Map<string, string></code> | Specify environment variables for the main container.<br/>__*Optional*__



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
**allowedConnections**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Allow others access to the traffic port.<br/>__*Optional*__
**authBypassHeaderValue**? | <code>string</code> | Provide a value that can be used to bypass authentication with headers.<br/>__*Optional*__
**authWithUserPool**? | <code>[CognitoAuthenticationConfig](#wheatstalk-cdk-ecs-website-cognitoauthenticationconfig)</code> | Instruct the service to authenticate with the cognito user pool.<br/>__*Optional*__
**capacityType**? | <code>[EcsWorkloadCapacityType](#wheatstalk-cdk-ecs-website-ecsworkloadcapacitytype)</code> | Type of compute capacity.<br/>__*Default*__: EcsExtensionCapacityType.EC2
**connectToPeers**? | <code>Array<[IConnectable](#aws-cdk-aws-ec2-iconnectable)></code> | Register the service as allowed in others' ingresses.<br/>__*Optional*__
**databaseConnection**? | <code>[IConnectable](#aws-cdk-aws-ec2-iconnectable)</code> | When provided, an ingress rule will be added to the database's security group so that ECS can connect to the database.<br/>__*Optional*__
**desiredCount**? | <code>number</code> | Desired task count.<br/>__*Default*__: 1
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


